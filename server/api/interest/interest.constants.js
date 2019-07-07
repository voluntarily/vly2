const InterestFields = {
  ID: '_id',
  COMMENT: 'title',
  STATUS: 'subtitle',
  DATE_ADDED: 'imgUrl',
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
  InterestSubject: 'Interest',
  InterestFields,
  InterestStatus
}
