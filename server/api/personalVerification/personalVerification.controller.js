const Person = require('../person/person')
const PersonalVerification = require('./personalVerification')
const {PersonalVerificationStatus} = require("./personalVerification.constants")
const { createNonce, createReference, createUnixTimestamp, postRequest, getRequest} = require("./personalVerification.helpers")
const {config} = require("../../../config/serverConfig")


/**
  api/verify -> initiates the verification process
 */
const initVerify = async (req, res) => {

  const me = req && req.session && req.session.me
  if (!me) {
    return res.sendStatus(401)
  }

  const person = await Person.findById(me._id).lean().exec()
  if (!person) {
    return res.sendStatus(404)
  }
  
  const reference = createReference()
  new PersonalVerification({
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

  let obj = {
    data: JSON.stringify(data),
    key: config.verification.cloudcheck.apiKey,
    nonce,
    timestamp
  }

  const liveResponse = await postRequest({
    data: obj,
    path: '/live/'
  })

  const query = { voluntarilyReference: liveResponse.capture.reference };
  const update = { captureReference: liveResponse.capture.captureReference, status: PersonalVerificationStatus.IN_PROGRESS }  

  Person.findOneAndUpdate({_id: me._id}, {
    verifiedDateOfBirth: { status: PersonalVerificationStatus.IN_PROGRESS },
    verifiedAddress: { status: PersonalVerificationStatus.IN_PROGRESS },
    verifiedName: { status: PersonalVerificationStatus.IN_PROGRESS }
  }, () => console.log("Person verified* updated to IN_PROGRESS"))

  PersonalVerification.findOneAndUpdate(query, update, () => console.log("Personal Verification updated to IN_PROGRESS"))

  return res.redirect(liveResponse.capture.url)  
}

const verifyLiveCallback = async (req, res) => {
    const liveCaptured = req.query.liveCaptured
    const liveToken = req.query.liveToken
    const captureReference = req.query.captureReference

    const query = { voluntarilyReference: req.query.liveReference, captureReference };
    const update = { liveCaptured, liveToken }
    
    const personalVerification = await PersonalVerification.findOne(query).exec()
    PersonalVerification.findOneAndUpdate(query, update, () => console.log("Personal Verification updated with liveCapture & liveToken"))

    const driversLicence = await getDriversLicenceData(captureReference)
    const driversLicenceVerificationResult  = await verifyDirversLicence(driversLicence, personalVerification.person, req.query.liveReference)
    
    let driversLicenceVerificationUpdate;
    
    if (!driversLicenceVerificationResult || driversLicenceVerificationResult.verification.errorDetail) {
      console.error(`Failed verification of drivers licence with message: ${driversLicenceVerificationResult.verification.errorDetail}`)
      driversLicenceVerificationUpdate = { 
        status: PersonalVerificationStatus.FAILED,
        verificationObject: driversLicenceVerificationResult
      }
    } else {
      const verificationReference = driversLicenceVerificationResult.verification.verificationReference
      
      driversLicenceVerificationUpdate = {
        status: driversLicenceVerificationResult.verification.verificationSuccess ? PersonalVerificationStatus.VERIFIED : PersonalVerificationStatus.NOT_VERIFIED,
        verificationReference,
        verificationObject: driversLicenceVerificationResult
      }

      const personUpdate = {
          verifiedDateOfBirth: {
            status: driversLicenceVerificationResult.verification.validated.dateofbirth ? PersonalVerificationStatus.VERIFIED : PersonalVerificationStatus.NOT_VERIFIED,
            verificationReference 
          },
          verifiedAddress: {
            status: driversLicenceVerificationResult.verification.validated.address ? PersonalVerificationStatus.VERIFIED : PersonalVerificationStatus.NOT_VERIFIED,
            verificationReference 
          },
          verifiedName: {
            status: driversLicenceVerificationResult.verification.validated.name ? PersonalVerificationStatus.VERIFIED : PersonalVerificationStatus.NOT_VERIFIED,
            verificationReference 
          }
        }
        Person.findOneAndUpdate({_id: personalVerification.person}, personUpdate, () => console.log("Updated Person with verification result"))
      }

    PersonalVerification.findOneAndUpdate(query, driversLicenceVerificationUpdate, () => console.log("Updated Personal Verification object"))
    res.redirect(`${config.appUrl}/home?tab=profile`)
}

const verifyDirversLicence = async (driversLicence, personId, reference) => {
  // TODO: Solve problem that we need the address to do the call
  const data = {
        details: {
            address: {
                suburb: "Hillsborough",
                street: "27 Indira Lane",
                postcode: "8022",
                city: "Christchurch"
            },
            name: {
                given: driversLicence.givenName,
                middle: driversLicence.middleName,
                family: driversLicence.familyName
            },
            dateofbirth: driversLicence.dateOfBirth,
            driverslicence: {
                number: driversLicence.number,
                version: driversLicence.version
            }
        },
        reference,
        consent: "Yes"
      }
  
      
      let objVerify = {
        data: JSON.stringify(data),
        key: config.verification.cloudcheck.apiKey,
        nonce: createNonce(),
        timestamp: createUnixTimestamp(),
        username: personId
      }
      
    return await postRequest({
      path: '/verify/', 
      data: objVerify
    })

}

const getDriversLicenceData = async (captureReference) => {
  let obj = {
    captureReference,
    key: config.verification.cloudcheck.apiKey,
    nonce: createNonce(),
    timestamp: createUnixTimestamp()
  }

  const liveResponseData = await getRequest({
    path: '/live/response/',
    data: obj
  })

  const driversLicences = liveResponseData.recognizedDocuments.filter(document => document.documentType === "NZ_DRIVER_LICENCE")
  
  if(driversLicences.length !== 1) {
    throw Error("No Drivers Licence found.") // TODO hanlde no drivers licence
  }

  return driversLicences[0]
}




module.exports = {
  initVerify,
  verifyLiveCallback
}
