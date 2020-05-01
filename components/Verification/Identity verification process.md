# The identify verification process

## Client side:
Process starts client side when the person clicks the verify identity button or a similar Goal Card. 

The  <Verification> component is on the <PersonDetail> Page has a  <VerifyButton> 'Verify Identity' button and two modal boxes for success and failure.

OnClick for Verify Identity goes to /verification/conduct which when accepted goes to /verification/safety which then tries to call
/api/verify

the handler for /api/verify is set in /server/api/PersonalVerification/PersonalVerification.routes.js

  server.get('/api/verify', initVerify)
  server.get('/api/verify/live/callback', verifyLiveCallback)

Hence initVerify is called,  on return from CloudCheck verifyLiveCallback is called which returns the resulting page to the browser.

## Server side
### initVerify  PersonalVerification.controller.js

#### Initial check
Check the caller is signed in and found in the people collection.

#### create new PersonalVerification record
create a new PersonalVerification record with the person id and a unique identifier voluntarilyReference: reference

PersonalVerification has these fields initially

* __status__: VerificationStatus: default *NOT_VERIFIED*, VERIFIED, IN_PROGRESS, FAILED
* __person__: ref to person (_id)
*  __voluntarilyReference__: cuid for matching when person has multiple requests.(should be unique) - we perhaps should use the _id.

#### create and make the first cloud check live call
* Generate a nonce (cuid) and timestamp 
In cryptography, a nonce is an arbitrary number that can be used just once in a cryptographic communication - to avoid replay attacks.

* generate the request body and post to cloudcheck
  
````
postCloudcheck: /live 
{
  data: {
    "callback":"http://localhost:3122/api/verify/live/callback","reference":"5bd85665-82d8-48ce-862a-f6af39ec9469"
  },
  key: 'XXXXXXXXXXXXXX',
  nonce: '25a46c37-5e28-4d4f-9d44-e587c99081d5',
  timestamp: 1588299443000
}
````
* postCloudCheck signs the request parameters

````
crypto.createHmac 'sha256' with the cloudcheck secret
````
* and sends request to CloudCheck.
* which returns a json record giving the next step

````
liveResponse: {
  capture: {
    captureReference: '424c336f-4c76-4e3a-a88b-851630faa83d',
    reference: '5bd85665-82d8-48ce-862a-f6af39ec9469',
    status: 'PENDING',
    createdDate: '2020-05-01 14:17',
    completed: false,
    url: 'https://api.cloudcheck.co.nz/live/xUQz4M8i70OZwTVo5MK4YLjh0iW5cx3xu5mfcA6clU0KWW0g/',
    ipAddresses: [ '49.227.191.209' ],
    images: [],
    recognizedDocuments: []
  }
}
````
#### record the information for use in the callback
* update the PersonalVerification record
  matching the capture.reference == voluntarilyReference.

  to update
    captureReference: liveResponse.capture.captureReference, 
    status: PersonalVerificationStatus.IN_PROGRESS

* update the Person record
  (I'm not sure this is useful. but if the cloud process is abandoned the records will be left in the person.)
  ````
    verified: [
      { name: PersonFields.NAME, status: PersonalVerificationStatus.IN_PROGRESS },
      { name: PersonFields.ADDRESS, status: PersonalVerificationStatus.IN_PROGRESS },
      { name: PersonFields.DOB, status: PersonalVerificationStatus.IN_PROGRESS }
    ]
  ````
#### finally the page request returns a redirect to the cloudcheck page
Using the URL in the liveResponse.capture record.

### Cloudcheck now takes over. 
* take a photo of the person face on
* take a photo of the person 45 degrees on
* take a photo of the driver's licence document
* redirect back to the callback page for voluntarily: http://localhost:3122/api/verify/live/callback
  with key information in the URL parameters.


### verifyLiveCallback 
On completing the cloudcheck process the browser is redirected back to our callback url with the result information in the url params

#### example request:

    Request URL: http://localhost:3122/api/verify/live/callback?liveCaptured=true&liveReference=5bd85665-82d8-48ce-862a-f6af39ec9469&liveToken=xUQz4M8i70OZwTVo5MK4YLjh0iW5cx3xu5mfcA6clU0KWW0g&captureReference=424c336f-4c76-4e3a-a88b-851630faa83d
  
we receive back from cloudCheck these fields
````
  liveCaptured - true | false
  liveReference - should match original request voluntarilyReference.
  liveToken - 
  captureReference - matching the ref in the previous liveResponse
````
#### Find and Update the  PersonalVerification record
* find a pv record matching the voluntarily and capture references.
* update the fields { liveCaptured, liveToken }

The record now looks like:
````
{
  "_id": "5eab71c6516b5056d3a0a6bf"
  "status": "not_verified",
  "person": "5e741d1690a90b25c72fc9b3"
  "voluntarilyReference": "7bc1f2c0-9b43-4649-acce-4dd4cc3a75f9",
  "captureReference": "613abb02-7f65-4a57-8afc-2577b4faa9f2",
  "liveCaptured": "true",
  "liveToken": "FPmg5oFwi2BauXB9uoKhAeCYzMVYGqISvUwlO6nztdDwgEPL",
}
````
This doesn't give us any actual information but provides keys to request the results of the capture.

#### get Driver's licence information
````
const driversLicence = await getDriversLicenceData(captureReference)
````
##### getCloudCheck getCloudcheck /live/response 
* create a new request with the usual reference, key, nonce, timestamp and sig
````
  {
    captureReference: '424c336f-4c76-4e3a-a88b-851630faa83d',
    key: 'XXXXXXXXXXX',
    nonce: '6738e0a6-55e3-4cc6-a8a7-b7276c08760f',
    timestamp: 1588301410000,
    signature: 'd00b85cef2030bb9adf2f870ae86ee274baad457e66aaf35bd6fee6dc68f855c'
  }
````
* receive back a summary of the available information
This includes whether the person matched their identity documents and the results of OCR on the document

````
{
  captureReference: '424c336f-4c76-4e3a-a88b-851630faa83d',
  reference: '5bd85665-82d8-48ce-862a-f6af39ec9469',
  status: 'MATCH',
  matchPercentage: 99,
  createdDate: '2020-05-01 14:17',
  completed: true,
  completedDate: '2020-05-01 14:18',
  ipAddresses: [ '49.227.191.209' ],
  images: [
    {
      type: 'Face and Head',
      whenCaptured: '2020-05-01 14:17',
      url: 'https://api.cloudcheck.co.nz/live/download/xUQz4M8i70OZwTVo5MK4YLjh0iW5cx3xu5mfcA6clU0KWW0g/326/'
    },
    {
      type: 'Face and Head Turned',
      whenCaptured: '2020-05-01 14:17',
      url: 'https://api.cloudcheck.co.nz/live/download/xUQz4M8i70OZwTVo5MK4YLjh0iW5cx3xu5mfcA6clU0KWW0g/400/',
      matchPercentage: 100
    },
    {
      type: 'Photo Identification',
      whenCaptured: '2020-05-01 14:18',
      url: 'https://api.cloudcheck.co.nz/live/download/xUQz4M8i70OZwTVo5MK4YLjh0iW5cx3xu5mfcA6clU0KWW0g/325/',
      matchPercentage: 99
    }
  ],
  recognizedDocuments: [
    {
      imageRecognized: 'Photo Identification',
      imageUrl: 'https://api.cloudcheck.co.nz/live/download/xUQz4M8i70OZwTVo5MK4YLjh0iW5cx3xu5mfcA6clU0KWW0g/325/',
      documentType: 'NZ_DRIVER_LICENCE',
      issueCountry: 'NZL',
      number: 'di366993',
      version: '416',
      familyName: 'watkins',
      givenName: 'andrew',
      middleName: 'vincent',
      dateOfBirth: '1962-07-19'
    }
  ]
}
````
We now know that the person's face matched the photo id but not that the ID is a real one.

#### extract the DL information

We check the recognised documents list for an NZ_DRIVER_LICENCE
( not sure what we do if its not NZ )
we now have a full name, dob and dl number

### verify the details on the driver's licence
verifyDriversLicence: We create another request to cloudcheck that contains the given information plus the address.
````
verifyDriversLicence {
  data: '{"details":{"name":{"given":"andrew","middle":"vincent","family":"watkins"},"dateofbirth":"1900-07-19","driverslicence":{"number":"diXXXXXX","version":"416"}},"reference":"5bd85665-82d8-48ce-862a-f6af39ec9469","consent":"Yes"}',
  key: 'XXXXXXXXXX',
  nonce: 'cc506c46-9c0d-4601-9246-3257df314fd4',
  timestamp: 1588302046000,
  username: 5e741d1690a90b25c72fc9b3
}
````
and receive back suitable validation.

Error example: verificationSuccess is false
````
verifyDriversLicence {
  "verification": {
    "reference": "5bd85665-82d8-48ce-862a-f6af39ec9469",
    "verificationSuccess": false,
    "validated": {
      "dateofbirth": false,
      "address": false,
      "name": false
    },
    "sources": [
      {
        "success": false,
        "name": "Test Source (Driver’s Licence)",
        "error": false
      }
    ],
    "verificationReference": "cca1442e-3df2-4f2a-a950-23e0c7b5e357",
    "requestDate": "2020-05-01 15:16",
    "ipAddress": "",
    "details": {
      "dateofbirth": "1962-07-19",
      "name": {
        "given": "andrew",
        "middle": "vincent",
        "family": "watkins"
      }
    }
  }
}
````
* handle errors
  if there is no dl verify result or the result contains an error we update the PV record with
      status: PersonalVerificationStatus.FAILED,
      verificationObject: driversLicenceVerificationResult

  and update the person with 
  NAME, DOB, ADDRESS as PersonalVerificationStatus.FAILED,

* handle good response
  the response may not be an error but may still not validate the requested fields

      "validated": {
        "dateofbirth": false,
        "address": false,
        "name": false
      },

  in this case we update the PersonalVerification record with status: VERIFIED or NOT_VERIFIED depending on the value of the validated field. along with the
  
        verificationReference,
        verificationObject: driversLicenceVerificationResult
      

