const Organisation = require('./organisation')
const { OrganisationRole } = require('./organisation.constants')

const orgProfileCompletenessById = async (orgId) => {
  const org = await Organisation.findById(orgId).exec()
  if (!org) return false
  return orgProfileCompleteness(org)
}

const orgProfileCompleteness = (org) => {
  let score = 0
  let count = 0

  const scoreStr = (str, len) => {
    score += str ? str.length >= len && 1 : 0
    count += 1
  }
  const scoreNum = (n, min, max) => {
    score += (n >= min && n <= max) ? 1 : 0
    count += 1
  }
  // calculate completeness of orgProfile.
  scoreStr(org.name, 4)
  scoreStr(org.imgUrl, 10) // http://a.co is shortest url
  scoreStr(org.website, 10) // http://a.co is shortest url
  // scoreStr(org.facebook, 10)
  // scoreStr(org.twitter, 10)
  scoreStr(org.info.about, 100) // at least 100 words about the org.
  // scoreStr(org.info.instructions)
  // scoreStr(org.info.followers,10)
  // scoreStr(org.info.joiners,10)
  // scoreStr(org.info.members,10)
  // scoreStr(org.info.outsiders,10)
  scoreStr(org.contactName, 10)
  scoreStr(org.contactPhoneNumber, 7)
  scoreStr(org.address, 10)
  if (org.role.includes(OrganisationRole.OPPORTUNITY_PROVIDER)) {
    scoreNum(org.ageRange.from, 1, 100)
    scoreNum(org.ageRange.to, 1, 100)
    scoreNum(org.decile, 1, 10)
  }
  return { score, count }
}

module.exports = {
  orgProfileCompleteness,
  orgProfileCompletenessById
}
