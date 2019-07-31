const MemberFields = {
  ID: '_id',
  STATUS: 'status',
  DATE_ADDED: 'dateAdded',
  PERSON: 'person',
  ORGANISATION: 'organisation',
  VALIDATION: 'validation'
}

const MemberStatus = {
  FOLLOWER: 'follower',
  JOINER: 'joiner',
  MEMBER: 'member',
  EXMEMBER: 'exmember'
}

module.exports = {
  SchemaName: 'Member',
  MemberFields,
  MemberStatus
}
