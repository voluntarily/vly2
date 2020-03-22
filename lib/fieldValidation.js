const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/

const validationRules = {
  domainName: (str) => {
    return str &&
      typeof str === 'string' &&
      str.match(domainRegex) &&
      str.length <= 253 // https://webmasters.stackexchange.com/questions/16996/maximum-domain-name-length
  }

}

module.exports = {
  validationRules,
  domainRegex
}
