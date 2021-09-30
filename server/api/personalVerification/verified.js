import { PersonFields } from '../person/person.constants.js'
import { PersonalVerificationStatus } from './personalVerification.constants.js'

export const isVerified = field => me => {
  return !!(me.verified && me.verified.find(check => check.name === field && check.status === PersonalVerificationStatus.VERIFIED))
}

/**
 * updates the field validated status in a person
 * @param {} field -> which field name to update
 * @param {} status -> new status
 * @param {Person} me -> person to update
 */
export const setVerified = field => async (status, value, me) => {
  if (!me.verified) { me.verified = [] }
  const fieldVerified = me.verified.find(check => check.name === field)
  if (fieldVerified &&
    fieldVerified.status === status) {
    return // nothing to do
  }
  if (!fieldVerified) { // new value
    me.verified.push({ name: field, status: status, value: value })
  } else { // update existing value
    fieldVerified.status = status
    fieldVerified.value = value
  }
  await me.save()
}

export const isEmailVerified = isVerified(PersonFields.EMAIL)
export const isNameVerified = isVerified(PersonFields.NAME)
export const isAddressVerified = isVerified(PersonFields.ADDRESS)
export const setEmailVerified = setVerified(PersonFields.EMAIL)

export const VerificationLevel = {
  NOT_OK: -1, // vet completed - not ok.
  // NONE: 0,
  EMAIL: 1, // email verified
  NAME: 2, // name verified
  ADDRESS: 3, // address verified
  VET_STARTED: 4, // police vet started
  VETTED: 5 // police vet completed ok
}

export const getVerificationLevels = person => {
  const levels = []
  if (isEmailVerified(person)) {
    levels.push(VerificationLevel.EMAIL)
  }
  if (isNameVerified(person)) {
    levels.push(VerificationLevel.NAME)
  }
  if (isAddressVerified(person)) {
    levels.push(VerificationLevel.ADDRESS)
  }

  return levels
}
