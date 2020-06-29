export const liveInitResponseError = {
  body: {
    status: 400,
    error: 'There has been an error'
  }
}

export const liveInitResponseSuccess = {
  body: {
    capture: {
      reference: 'voluntarily-reference',
      captureReference: 'capture-reference',
      createdDate: '2013-05-06 12:02',
      completed: false,
      url: 'redirect-url',
      status: 'PENDING',
      recognizedDocuments: [],
      images: [],
      ipAddresses: [
        '127.0.0.1'
      ]
    }
  }
}

export const liveResponseSuccess = {
  body: {
    capture: {
      reference: 'SJ Run 343555621',
      matchPercentage: 95,
      recognizedDocuments: [
        {
          number: 'AX123456',
          documentType: 'NZ_DRIVER_LICENCE',
          imageRecognized: 'Photo Identification',
          imageUrl: 'https://api.cloudcheck.co.nz/live/download/4surMyHIfA4s87BtFVuY6bm7ivS8SRqMF038AbSgrvBvAka8/331/',
          familyName: 'Smith',
          givenName: 'Michael',
          issueCountry: '',
          middleName: '',
          version: '709',
          dateOfBirth: '1989-04-08'
        }
      ],
      images: [
        {
          whenCaptured: '2019-08-29 16:20',
          type: 'Face and Head',
          url: 'https://api.cloudcheck.co.nz/live/download/4surMyHIfA4s87BtFVuY6bm7ivS8SRqMF038AbSgrvBvAka8/332/'
        },
        {
          matchPercentage: 76,
          whenCaptured: '2019-08-29 16:21',
          type: 'Face and Head Turned',
          url: 'https://api.cloudcheck.co.nz/live/download/4surMyHIfA4s87BtFVuY6bm7ivS8SRqMF038AbSgrvBvAka8/519/'
        },
        {
          matchPercentage: 91,
          whenCaptured: '2019-08-29 16:21',
          type: 'Photo Identification',
          url: 'https://api.cloudcheck.co.nz/live/download/4surMyHIfA4s87BtFVuY6bm7ivS8SRqMF038AbSgrvBvAka8/331/'
        }
      ],
      createdDate: '2019-08-29 16:19',
      captureReference: '5e8136d6-568a-418f-a076-85fe1d79fdd1',
      ipAddresses: [
        '103.14.71.185'
      ],
      completed: true,
      completedDate: '2019-08-29 16:21',
      status: 'MATCh'
    }
  }
}

export const verifyResponseData = {
  body: {
    verification: {
      details: {
        address: {
          suburb: 'Anytown',
          street: '123 Poplar Road',
          postcode: '1234',
          city: 'Somewhereville'
        },
        name: {
          given: 'Jane',
          middle: 'Wendy',
          family: 'Smith'
        },
        dateofbirth: '1970-01-01'
      },
      verificationDate: '2013-05-06 12:02',
      verificationReference: 'dac9d987-4007-4dd9-b5a6-cf547232836c',
      verificationSuccess: true,
      verificationPartialSuccess: false,
      validated: {
        address: true,
        name: true,
        pepMatched: false,
        dateofbirth: true
      },
      sources: [
        {
          name: 'Companies Office',
          success: true,
          error: false
        },
        {
          name: 'NZTA (Driver‘s Licence)',
          success: true,
          error: false,
          notes: 'License Match: Yes'
        }
      ],
      reference: '1',
      requestDate: '2013-05-06 12:00',
      ipAddress: '127.0.0.1'
    }
  }
}
