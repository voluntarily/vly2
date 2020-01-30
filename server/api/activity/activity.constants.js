const ActivityStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  RETIRED: 'retired'
}

const ActivityFields = {
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

module.exports = {
  SchemaName: 'Activity',
  ActivityStatus,
  ActivityFields
}
