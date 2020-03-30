const InterestFields = {
  ID: '_id',
  COMMENT: 'comment',
  STATUS: 'status',
  DATE_ADDED: 'createdAt',
  PERSON: 'person',
  OPPORTUNITY: 'opportunity',
  MESSAGES: 'messages'
}

const InterestStatus = {
  INTERESTED: 'interested',
  INVITED: 'invited',
  COMMITTED: 'committed',
  DECLINED: 'declined',
  ATTENDED: 'attended',
  NOTATTENDED: 'not_attended'
}

const InterestAction = {
  ACCEPT: 'accept',
  REJECT: 'reject',
  WITHDRAW: 'withdraw',
  MESSAGE: 'message'
}

module.exports = {
  InterestSchemaName: 'Interest',
  InterestArchiveSchemaName: 'InterestArchive',
  InterestFields,
  InterestAction,
  InterestStatus
}
