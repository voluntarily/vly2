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

const OpportunityType = {
  ASK: 'ask',
  OFFER: 'offer'
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
  TYPE: 'type',
  STATUS: 'status',
  NAME: 'name',
  SUBTITLE: 'subtitle',
  IMG_URL: 'imgUrl',
  DESCRIPTION: 'description',
  DURATION: 'duration',
  LOCATIONS: 'locations',
  ADDRESS: 'address',
  DATE: 'date',
  OFFER_ORG: 'offerOrg',
  REQUESTOR: 'requestor',
  FROM_ACTIVITY: 'fromActivity',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  TAGS: 'tags'
}

/* This list is currently used for requests returning a LIST
of opportunities, it contains fields required for the OpCard.
*/
const OpportunityListFields = [
  OpportunityFields.ID,
  OpportunityFields.TYPE,
  OpportunityFields.NAME,
  OpportunityFields.SUBTITLE,
  OpportunityFields.DESCRIPTION,
  OpportunityFields.IMG_URL,
  OpportunityFields.STATUS,
  OpportunityFields.DATE,
  OpportunityFields.LOCATIONS,
  OpportunityFields.ADDRESS,
  OpportunityFields.DURATION,
  OpportunityFields.REQUESTOR,
  OpportunityFields.OFFER_ORG,
  OpportunityFields.FROM_ACTIVITY,
  OpportunityFields.CREATED_AT
]

/* This list is currently used for both anon and signed in people
  all are required to make the OpDetailsPage work correctly.
*/
const OpportunityPublicFields = [
  ...OpportunityListFields,
  OpportunityFields.TAGS
]

module.exports = {
  SchemaName: 'Opportunity',
  OpportunityStatus,
  OpportunityPublishedStatus,
  OpportunityFields,
  OpportunityListFields,
  OpportunityPublicFields,
  OpportunityRoutes,
  OpportunityType
}
