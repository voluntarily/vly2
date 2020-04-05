const SchemaName = 'PersonalVerification'
const PersonalVerificationStatus = {
  NOT_VERIFIED: 'not_verified',
  VERIFIED: 'verified',
  IN_PROGRESS: 'in_progress',
  FAILED: 'failed'
}
const VerificationResultUrlQueryParam = 'verificationsuccessful'

module.exports = {
  SchemaName,
  PersonalVerificationStatus,
  VerificationResultUrlQueryParam
}
