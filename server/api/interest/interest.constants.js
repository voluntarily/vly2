const InterestFields = {
  ID: '_id',
  COMMENT: 'comment',
  STATUS: 'status',
  DATE_ADDED: 'dateAdded',
  PERSON: 'person',
  OPPORTUNITY: 'opportunity'
}

const InterestStatus = {
  INTERESTED: 'interested',
  INVITED: 'invited',
  COMMITTED: 'committed',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

module.exports = {
  SchemaName: 'Interest',
  InterestFields,
  InterestStatus
}
