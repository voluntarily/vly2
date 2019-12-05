const SchemaName = 'PersonalGoal'
const PersonalGoalStatus = {
  NONE: 'none', // no relationship
  QUEUED: 'queued', // goal has been issued but not started. initial state
  ACTIVE: 'active', // goal has been started but not finished - in progress
  COMPLETED: 'completed', // goal has been completed - met its evaluation test
  HIDDEN: 'hidden', // goal has been hidden (but not deleted)
  CANCELLED: 'cancelled' // goal has been cancelled.
}

module.exports = {
  SchemaName,
  PersonalGoalStatus
}
