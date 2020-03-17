const websiteRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/

const validationRules = {
  website: (str) => {
    return str &&
      typeof str === 'string' &&
      str.match(websiteRegex) &&
      str.length < 2000 // https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
  },
  domainName: (str) => {
    return str &&
      typeof str === 'string' &&
      str.match(domainRegex) &&
      str.length <= 253 // https://webmasters.stackexchange.com/questions/16996/maximum-domain-name-length
  }

}

module.exports = {
  validationRules,
  websiteRegex,
  domainRegex
}
