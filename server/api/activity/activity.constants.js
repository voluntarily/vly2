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
  STATUS: 'status',
  DOCUMENTS: 'documents',
  LOCKED: 'locked',
  LOCKFIELDS: 'lockfields'
}

const ActivityListFields = [
  ActivityFields.NAME,
  ActivityFields.SLUG,
  ActivityFields.STATUS,
  ActivityFields.SUBTITLE,
  ActivityFields.DURATION,
  ActivityFields.IMG_URL,
  ActivityFields.OFFERORG
]

// fields to populate an opportunity with a fromActivity
const ActivityOpFields = [
  ActivityFields.NAME,
  ActivityFields.SLUG,
  ActivityFields.IMG_URL,
  ActivityFields.OFFERORG,
  ActivityFields.LOCKED,
  ActivityFields.LOCKFIELDS
]
module.exports = {
  SchemaName: 'Activity',
  ActivityStatus,
  ActivityFields,
  ActivityListFields,
  ActivityOpFields
}
