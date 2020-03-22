const ActivityStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  RETIRED: 'retired',
  REVIEW: 'review'
}

const ActivityFields = {
  NAME: 'name',
  SLUG: 'slug',
  SUBTITLE: 'subtitle',
  IMG_URL: 'imgUrl',
  DESCRIPTION: 'description',
  DURATION: 'duration',
  OFFERORG: 'offerOrg',
  OWNER: 'owner',
  RESOURCE: 'resource',
  VOLUNTEERS: 'volunteers',
  SPACE: 'space',
  TIME: 'time',
  TAGS: 'tags',
  EQUIPMENT: 'equipment',
  ACTIVITYSTATUS: 'ActivityStatus',
  DOCUMENTS: 'documents',
  LOCKED: 'locked',
  LOCKFIELDS: 'lockfields'
}

const ActivityListFields = [
  ActivityFields.ID,
  ActivityFields.NAME,
  ActivityFields.SLUG,
  ActivityFields.IMG_URL,
  ActivityFields.OFFERORG
]
module.exports = {
  SchemaName: 'Activity',
  ActivityStatus,
  ActivityFields,
  ActivityListFields
}
