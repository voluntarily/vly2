const MemberFields = {
  ID: '_id',
  STATUS: 'status',
  DATE_ADDED: 'dateAdded',
  PERSON: 'person',
  ORGANISATION: 'organisation',
  VALIDATION: 'validation'
}

const MemberStatus = {
  NONE: 'none',
  FOLLOWER: 'follower', // person is a follower of the organisation
  JOINER: 'joiner', // person has requested to join the org
  VALIDATOR: 'validator', // person has submitted validation information
  MEMBER: 'member', // person is a member of the organisation
  EXMEMBER: 'exmember' // person has left the organisation
}

module.exports = {
  SchemaName: 'Member',
  MemberFields,
  MemberStatus
}
