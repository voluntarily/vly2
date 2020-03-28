const Person = require('../person/person')
const PersonalVerification = require('./personalVerification')
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
    _id: me._id,
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
  const update = { captureReference: liveResponse.capture.captureReference }
  PersonalVerification.findOneAndUpdate(query, update, () => console.log("executed"))

  return res.redirect(liveResponse.capture.url)  
}

const verifyLiveCallback = async (req, res) => {
    const liveCaptured = req.query.liveCaptured
    const liveToken = req.query.liveToken
    const captureReference = req.query.captureReference

    const query = { voluntarilyReference: req.query.liveReference, captureReference };
    const update = { liveCaptured, liveToken }
    
    const personalVerification = await PersonalVerification.findOne(query).exec()
    PersonalVerification.findOneAndUpdate(query, update, () => console.log("updated callback"))

    const driversLicence = await getDriversLicenceData(captureReference)
    const driversLicenceVerificationResult  = await verifyDirversLicence(driversLicence, personalVerification._id, req.query.liveReference)
    console.log(JSON.stringify(driversLicenceVerificationResult))

    if (!driversLicenceVerificationResult) {
      console.error("Failed verification of drivers licence")
    }
    res.redirect(`${config.appUrl}/home?tab=profile`)
}

const verifyDirversLicence = async (driversLicence, personId, reference) => {
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
