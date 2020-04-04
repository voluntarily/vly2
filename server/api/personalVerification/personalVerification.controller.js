const Person = require('../person/person')
const { PersonFields } = require('../person/person.constants')
const { PersonalVerification } = require('./personalVerification')
const { PersonalVerificationStatus, ErrorRedirectUrlQuery } = require('./personalVerification.constants')
const { createNonce, createReference, createUnixTimestamp, postCloudcheck, getCloudcheck } = require('./personalVerification.helpers')
const { config } = require('../../../config/serverConfig')

/**
  api/verify -> initiates the verification process
 */
const initVerify = async (req, res) => {
  try {
    const me = req && req.session && req.session.me
    if (!me) {
      throw Error('User is not authenticated')
    }

    const person = await Person.findById(me._id).lean().exec()
    if (!person) {
      throw Error('User not found')
    }

    const reference = createReference()
    await new PersonalVerification({
      person,
      voluntarilyReference: reference
    }).save()

    const nonce = createNonce()
    const timestamp = createUnixTimestamp()
    const callback = `${config.appUrl}/api/verify/live/callback`
    const data = {
      callback,
      reference
    }

    const obj = {
      data: JSON.stringify(data),
      key: config.verification.cloudcheck.apiKey,
      nonce,
      timestamp
    }

    const liveResponse = await postCloudcheck({
      data: obj,
      path: '/live/'
    })

    if (!(liveResponse && liveResponse.capture)) {
      throw Error(`Cloudcheck initVerification failed for reference: ${reference}, nonce: ${nonce}`)
    }

    const query = { voluntarilyReference: liveResponse.capture.reference }
    const update = { captureReference: liveResponse.capture.captureReference, status: PersonalVerificationStatus.IN_PROGRESS }

    await Person.findOneAndUpdate({ _id: me._id }, {
      verified: [
        { name: PersonFields.NAME, status: PersonalVerificationStatus.IN_PROGRESS },
        { name: PersonFields.ADDRESS, status: PersonalVerificationStatus.IN_PROGRESS },
        { name: PersonFields.DOB, status: PersonalVerificationStatus.IN_PROGRESS }
      ]
    }, () => console.log('Person verified* updated to IN_PROGRESS'))

    await PersonalVerification.findOneAndUpdate(query, update, () => console.log('Personal Verification updated to IN_PROGRESS'))

    return res.redirect(liveResponse.capture.url)
  } catch (error) {
    console.error(error)
    return res.redirect(`${config.appUrl}/home?tab=profile&${ErrorRedirectUrlQuery}`)
  }
}

const verifyLiveCallback = async (req, res) => {
  let driversLicenceVerificationUpdate
  let personUpdate
  let personalVerification
  let query
  let update
  try {
    const liveCaptured = req.query.liveCaptured
    const liveToken = req.query.liveToken
    const captureReference = req.query.captureReference

    query = { voluntarilyReference: req.query.liveReference, captureReference }
    update = { liveCaptured, liveToken }

    personalVerification = await PersonalVerification.findOne(query).exec()
    await PersonalVerification.findOneAndUpdate(query, update, () => console.log('Personal Verification updated with liveCapture & liveToken'))

    const driversLicence = await getDriversLicenceData(captureReference)
    const driversLicenceVerificationResult = await verifyDriversLicence(driversLicence, personalVerification.person, req.query.liveReference)

    if (!driversLicenceVerificationResult || driversLicenceVerificationResult.verification.error) {
      console.error(`Failed verification of drivers licence with message: ${driversLicenceVerificationResult.verification}`)
      driversLicenceVerificationUpdate = {
        status: PersonalVerificationStatus.FAILED,
        verificationObject: driversLicenceVerificationResult
      }
      personUpdate = createPersonVerifiedUpdate(
        PersonalVerificationStatus.FAILED,
        PersonalVerificationStatus.FAILED,
        PersonalVerificationStatus.FAILED,
        undefined
      )
      throw Error('Error verifying Driverlicence data')
    } else {
      console.log(driversLicenceVerificationResult)

      const verificationReference = driversLicenceVerificationResult.verification.verificationReference

      driversLicenceVerificationUpdate = {
        status: driversLicenceVerificationResult.verification.verificationSuccess ? PersonalVerificationStatus.VERIFIED : PersonalVerificationStatus.NOT_VERIFIED,
        verificationReference,
        verificationObject: driversLicenceVerificationResult
      }
      personUpdate = createPersonVerifiedUpdate(
        driversLicenceVerificationResult.verification.validated.name ? PersonalVerificationStatus.VERIFIED : PersonalVerificationStatus.NOT_VERIFIED,
        driversLicenceVerificationResult.verification.validated.address ? PersonalVerificationStatus.VERIFIED : PersonalVerificationStatus.NOT_VERIFIED,
        driversLicenceVerificationResult.verification.validated.dateofbirth ? PersonalVerificationStatus.VERIFIED : PersonalVerificationStatus.NOT_VERIFIED,
        verificationReference
      )
    }

    res.redirect(`${config.appUrl}/home?tab=profile`)
  } catch (error) {
    console.error(error)
    return res.redirect(`${config.appUrl}/home?tab=profile&${ErrorRedirectUrlQuery}`)
  } finally {
    await Person.findOneAndUpdate({ _id: personalVerification.person }, personUpdate, () => console.log('Updated Person with verification result'))
    await PersonalVerification.findOneAndUpdate(query, driversLicenceVerificationUpdate, () => console.log('Updated Personal Verification object'))
  }
}

const createPersonVerifiedUpdate = (
  nameStatus,
  addressStatus,
  dateOfBirthStatus,
  verificationReference
) => {
  return {
    verified: [
      {
        name: PersonFields.DOB,
        status: dateOfBirthStatus,
        verificationReference
      },
      {
        name: PersonFields.ADDRESS,
        status: addressStatus,
        verificationReference
      },
      {
        name: PersonFields.NAME,
        status: nameStatus,
        verificationReference
      }
    ]
  }
}

const verifyDriversLicence = async (driversLicence, personId, reference) => {
  // TODO: Solve problem that we need the address to do the call
  const data = {
    details: {
      address: {
        suburb: 'Hillsborough',
        street: '27 Indira Lane',
        postcode: '8022',
        city: 'Christchurch'
      },
      name: {
        given: driversLicence.givenName ? driversLicence.givenName : undefined,
        middle: driversLicence.middleName ? driversLicence.middleName : undefined,
        family: driversLicence.familyName ? driversLicence.familyName : undefined
      },
      dateofbirth: driversLicence.dateOfBirth ? driversLicence.dateOfBirth : undefined,
      driverslicence: {
        number: driversLicence.number,
        version: driversLicence.version
      }
    },
    reference,
    consent: 'Yes'
  }

  // TODO: Remove
  console.log(data)

  const objVerify = {
    data: JSON.stringify(data),
    key: config.verification.cloudcheck.apiKey,
    nonce: createNonce(),
    timestamp: createUnixTimestamp(),
    username: personId
  }

  return postCloudcheck({
    path: '/verify/',
    data: objVerify
  })
}

const getDriversLicenceData = async (captureReference) => {
  const obj = {
    captureReference,
    key: config.verification.cloudcheck.apiKey,
    nonce: createNonce(),
    timestamp: createUnixTimestamp()
  }

  const liveResponseData = await getCloudcheck({
    path: '/live/response/',
    data: obj
  })

  const driversLicences = liveResponseData.recognizedDocuments.filter(document => document.documentType === 'NZ_DRIVER_LICENCE')

  if (driversLicences.length !== 1) {
    throw Error('No Drivers Licence found.') // TODO hanlde no drivers licence
  }

  return driversLicences[0]
}

module.exports = {
  initVerify,
  verifyLiveCallback
}
