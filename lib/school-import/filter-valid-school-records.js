const emailDomainAllowList = [
  '.school.nz'
]

const hasAllowedDomain = (emailDomain) => {
  for (const allowedEmailDomain of emailDomainAllowList) {
    if (emailDomain.endsWith(allowedEmailDomain)) {
      return true
    }
  }

  return false
}

const filterValidSchoolRecords = (unfilteredSchoolRecords) => {
  return unfilteredSchoolRecords
    .filter(school => school.emailDomain !== '')
    .filter(school => hasAllowedDomain(school.emailDomain))
}

module.exports = filterValidSchoolRecords
