const SchemaName = 'PersonalVerification'
const PersonalVerificationStatus = {
  NOT_VERIFIED: 'not_verified',
  VERIFIED: 'verified',
  IN_PROGRESS: 'in_progress',
  FAILED: 'failed'
}
const ErrorRedirectUrlQuery = 'verificationerror=true'

module.exports = {
  SchemaName,
  PersonalVerificationStatus,
  ErrorRedirectUrlQuery
}
