const Person = require('../person/person')
const { PersonFields } = require('../person/person.constants')
const { PersonalVerification } = require('./personalVerification')
const { PersonalVerificationStatus, VerificationResultUrlQueryParam } = require('./personalVerification.constants')
const { createNonce, createReference, createUnixTimestamp, postCloudcheck, getCloudcheck } = require('./personalVerification.helpers')
const { config } = require('../../../config/serverConfig')
const { NOT_VERIFIED, VERIFIED, IN_PROGRESS, FAILED } = PersonalVerificationStatus
const redirectUrl = `${config.appUrl}/home?tab=profile&${VerificationResultUrlQueryParam}=`

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
    console.log('postCloudcheck: /live', obj)
    const liveResponse = await postCloudcheck({
      data: obj,
      path: '/live/'
    })
    console.log(('postCloudcheck: ', liveResponse))
    if (!(liveResponse && liveResponse.capture)) {
      throw Error(`Cloudcheck initVerification failed for reference: ${reference}, nonce: ${nonce}`)
    }

    const query = { voluntarilyReference: liveResponse.capture.reference }
    const update = { captureReference: liveResponse.capture.captureReference, status: IN_PROGRESS }

    await Person.findOneAndUpdate({ _id: me._id }, {
      verified: [
        { name: PersonFields.NAME, status: IN_PROGRESS },
        { name: PersonFields.ADDRESS, status: IN_PROGRESS },
        { name: PersonFields.DOB, status: IN_PROGRESS }
      ]
    }, () => console.log('Person verified* updated to IN_PROGRESS'))

    await PersonalVerification.findOneAndUpdate(query, update, () => console.log('Personal Verification updated to IN_PROGRESS'))

    return res.redirect(liveResponse.capture.url)
  } catch (error) {
    console.error(error)
    return res.redirect(`${redirectUrl}false`)
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
    console.log('verifyDriversLicence', JSON.stringify(driversLicenceVerificationResult, null, 2))

    if (!driversLicenceVerificationResult || driversLicenceVerificationResult.verification.error) {
      console.error('Failed verification of drivers licence with message:', driversLicenceVerificationResult.verification)
      driversLicenceVerificationUpdate = {
        status: FAILED,
        verificationObject: driversLicenceVerificationResult
      }
      personUpdate = createPersonVerifiedUpdate(
        FAILED, undefined,
        FAILED, undefined,
        FAILED, undefined,
        undefined
      )
      throw Error('Error verifying Driverlicence data')
    } else {
      const dlv = driversLicenceVerificationResult.verification
      const verificationReference = dlv.verificationReference

      driversLicenceVerificationUpdate = {
        status: dlv.verificationSuccess ? VERIFIED : NOT_VERIFIED,
        verificationReference,
        verificationObject: driversLicenceVerificationResult
      }
      personUpdate = createPersonVerifiedUpdate(
        dlv.validated.name ? VERIFIED : NOT_VERIFIED,
        `${dlv.details.name.given} ${dlv.details.name.middle} ${dlv.details.name.family}`,
        dlv.validated.address ? VERIFIED : NOT_VERIFIED,
        `${dlv.details.address.street} ${dlv.details.address.suburb} ${dlv.details.address.city} ${dlv.details.address.postcode}`,
        dlv.validated.dateofbirth ? VERIFIED : NOT_VERIFIED,
        dlv.details.dateofbirth,
        verificationReference
      )
    }

    res.redirect(`${redirectUrl}true`)
  } catch (error) {
    console.error(error)
    return res.redirect(`${redirectUrl}false`)
  } finally {
    await Person.findOneAndUpdate({ _id: personalVerification.person }, personUpdate, () => console.log('Updated Person with verification result'))
    await PersonalVerification.findOneAndUpdate(query, driversLicenceVerificationUpdate, () => console.log('Updated Personal Verification object'))
  }
}

const createPersonVerifiedUpdate = (
  nameStatus, nameValue,
  addressStatus, addressValue,
  dateOfBirthStatus, dateOfBirthValue,
  verificationReference
) => {
  return {
    verified: [
      {
        name: PersonFields.DOB,
        status: dateOfBirthStatus,
        value: dateOfBirthValue,
        verificationReference
      },
      {
        name: PersonFields.ADDRESS,
        status: addressStatus,
        value: addressValue,
        verificationReference
      },
      {
        name: PersonFields.NAME,
        status: nameStatus,
        value: nameValue,
        verificationReference
      }
    ]
  }
}

const verifyDriversLicence = async (driversLicence, personId, reference) => {
  // TODO: Once we have the address enable verification
  const data = {
    details: {
      address: {
        suburb: 'Auckland Central',
        street: '5F 16 Gore St',
        postcode: '1010',
        city: 'Auckland'
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

  const objVerify = {
    data: JSON.stringify(data),
    key: config.verification.cloudcheck.apiKey,
    nonce: createNonce(),
    timestamp: createUnixTimestamp(),
    username: personId
  }
  console.log('verifyDriversLicence', objVerify)
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
  console.log('getCloudcheck /live/response', obj, liveResponseData)
  const driversLicences = liveResponseData.recognizedDocuments.filter(document => document.documentType === 'NZ_DRIVER_LICENCE')
  console.log('driversLicences', driversLicences)
  if (driversLicences.length !== 1) {
    throw Error('No Drivers Licence found.') // TODO hanlde no drivers licence
  }

  return driversLicences[0]
}

module.exports = {
  initVerify,
  verifyLiveCallback
}
