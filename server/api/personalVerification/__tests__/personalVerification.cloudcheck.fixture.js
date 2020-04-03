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
      liveReference: 'voluntarily-reference',
      captureReference: 'capture-reference',
      liveCaptured: 'sdfgsdfgsdfg',
      liveToken: 'asdfasdfasdfasdf'
    }
  }
}
