const { Action } = require('../../services/abilities/ability.constants')

const OpportunityRoutes = {
  [Action.LIST]: '/orgs',
  [Action.READ]: '/orgs/:id',
  [Action.UPDATE]: '/orgs/:id/edit',
  [Action.CREATE]: '/org/new'
}

const OpportunityStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

const OpportunityFields = {
  ID: '_id',
  TITLE: 'title',
  SUBTITLE: 'subtitle',
  IMG_URL: 'imgUrl',
  DURATION: 'duration'
}

module.exports = {
  Subject: 'Opportunity',
  OpportunityStatus,
  OpportunityFields,
  OpportunityRoutes
}
