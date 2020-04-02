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
      url: 'redirect-url'
    }
  }
}
