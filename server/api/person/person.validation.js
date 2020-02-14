const websiteRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/

const validationRules = {
  website: (str) => {
    return str &&
      typeof str === 'string' &&
      str.match(websiteRegex) &&
      str.length < 2000 // https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
  }
}

module.exports = {
  validationRules,
  websiteRegex
}
