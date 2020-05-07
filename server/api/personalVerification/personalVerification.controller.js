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
    const liveResponse = await postCloudcheck({
      data: obj,
      path: '/live/'
    })
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
    })

    await PersonalVerification.findOneAndUpdate(query, update)

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
        dlv.details.name,
        dlv.validated.address ? VERIFIED : NOT_VERIFIED,
        dlv.details,
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
    await Person.findOneAndUpdate({ _id: personalVerification.person }, personUpdate)
    await PersonalVerification.findOneAndUpdate(query, driversLicenceVerificationUpdate)
  }
}

const titlify = str => str[0].toUpperCase() + str.slice(1)
const createPersonVerifiedUpdate = (
  nameStatus, nameValue,
  addressStatus, addressValue,
  dateOfBirthStatus, dateOfBirthValue,
  verificationReference
) => {
  const update = {
    verified: [
      {
        name: PersonFields.NAME,
        status: nameStatus,
        value: nameValue,
        verificationReference
      }, {
        name: PersonFields.DOB,
        status: dateOfBirthStatus,
        value: dateOfBirthValue,
        verificationReference
      }, {
        name: PersonFields.ADDRESS,
        status: addressStatus,
        value: addressValue,
        verificationReference
      }
    ]
  }
  if (nameStatus === VERIFIED) {
    update.name = Object.keys(nameValue).map(key => nameValue[key]).join(' ')
  }
  if (dateOfBirthStatus === VERIFIED) {
    update.dob = Date(dateOfBirthValue)
  }
  if (addressStatus === VERIFIED) {
    update.address = Object.keys(nameValue).map(key => titlify(nameValue[key])).join()
  }
  return update
}

const verifyDriversLicence = async (driversLicence, personId, reference) => {
  // TODO: Once we have the address enable verification
  const data = {
    details: {
      // address: {
      //   suburb: '',
      //   street: '',
      //   postcode: '',
      //   city: ''
      // },
      name: {
        given: driversLicence.givenName ? driversLicence.givenName : '',
        middle: driversLicence.middleName ? driversLicence.middleName : '',
        family: driversLicence.familyName ? driversLicence.familyName : ''
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
