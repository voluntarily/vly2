const { Action } = require('../../services/abilities/ability.constants')

const OpportunityRoutes = {
  [Action.LIST]: '/api/opportunities',
  [Action.READ]: '/api/opportunities/:id',
  [Action.UPDATE]: '/api/opportunities/:id/edit',
  [Action.CREATE]: '/api/opportunities/new'
}

const OpportunityStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

/**
 * An Opportunity is considered Published if it has one of these status.
 */
const OpportunityPublishedStatus = [
  OpportunityStatus.ACTIVE,
  OpportunityStatus.COMPLETED
]

const OpportunityFields = {
  ID: '_id',
  NAME: 'name',
  SUBTITLE: 'subtitle',
  IMG_URL: 'imgUrl',
  DESCRIPTION: 'description',
  DURATION: 'duration',
  LOCATION: 'location',
  STATUS: 'status',
  DATE: 'date',
  OFFER_ORG: 'offerOrg',
  REQUESTOR: 'requestor',
  FROM_ACTIVITY: 'fromActivity',
  DATE_ADDED: 'dateAdded',
  TAGS: 'tags'
}
const OpportunitySummaryFields = [
  OpportunityFields.ID,
  OpportunityFields.NAME,
  OpportunityFields.SUBTITLE,
  OpportunityFields.IMG_URL,
  OpportunityFields.STATUS,
  OpportunityFields.DATE,
  OpportunityFields.LOCATION,
  OpportunityFields.DURATION
]
module.exports = {
  SchemaName: 'Opportunity',
  OpportunityStatus,
  OpportunityPublishedStatus,
  OpportunityFields,
  OpportunitySummaryFields,
  OpportunityRoutes
}
