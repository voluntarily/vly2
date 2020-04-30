const { PersonFields } = require('../person/person.constants')
const { PersonalVerificationStatus } = require('./personalVerification.constants')

const isVerified = field => me => {
  return !!(me.verified && me.verified.find(check => check.name === field && check.status === PersonalVerificationStatus.VERIFIED))
}

/**
 * updates the field validated status in a person
 * @param {} field -> which field name to update
 * @param {} status -> new status
 * @param {Person} me -> person to update
 */
const setVerified = field => async (status, me) => {
  if (!me.verified) { me.verified = [] }
  const fieldVerified = me.verified.find(check => check.name === field)
  if (fieldVerified &&
    fieldVerified.status === status) {
    return // nothing to do
  }
  if (!fieldVerified) { // new value
    me.verified.push({ name: field, status: status })
  } else { // update existing value
    fieldVerified.status = status
  }
  await me.save()
}

const isEmailVerified = isVerified(PersonFields.EMAIL)
const isIdentityVerified = isVerified(PersonFields.NAME)
const setEmailVerified = setVerified(PersonFields.EMAIL)

const VerificationLevel = {
  NOT_OK: -1, // vet completed - not ok.
  // NONE: 0,
  EMAIL: 1, // email verified
  IDENTITY: 2, // identity verified
  VET_STARTED: 3, // police vet started
  VETTED: 4 // police vet completed ok
}

const getVerificationLevels = person => {
  const levels = []
  if (isEmailVerified(person)) {
    levels.push(VerificationLevel.EMAIL)
  }
  if (isIdentityVerified(person)) {
    levels.push(VerificationLevel.IDENTITY)
  }

  return levels
}

module.exports = {
  isVerified,
  setVerified,
  isEmailVerified,
  setEmailVerified,
  VerificationLevel,
  getVerificationLevels
}
