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
  DESCRIPTION: 'description',
  DURATION: 'duration',
  LOCATION: 'location',
  STATUS: 'status',
  DATE: 'date',
  OFFER_ORG: 'offerOrg',
  REQUESTOR: 'requestor',
  DATE_ADDED: 'dateAdded',
  TAGS: 'tags'
}

module.exports = {
  OpportunitySubject: 'Opportunity',
  OpportunityStatus,
  OpportunityFields,
  OpportunityRoutes
}
