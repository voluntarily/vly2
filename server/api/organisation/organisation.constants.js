const Category = {
  BUSINESS: 'vp',
  SCHOOL: 'op',
  ACTIVITYPROVIDER: 'ap',
  AGENCY: 'admin',
  OTHER: 'other'
}
const OrganisationFields = {
  NAME: 'name',
  SLUG: 'slug',
  IMGURL: 'imgUrl',
  WEBSITE: 'website',
  FACEBOOK: 'facebook',
  DOMAINNAME: 'domainName',
  TWITTER: 'twitter',
  CATEGORY: 'category',
  GROUPS: 'groups',
  INFO: 'info',
  CREATEDAT: 'createdAt',
  AGERANGE: 'ageRange',
  DECILE: 'decile',
  CONTACTNAME: 'contactName',
  CONTACTEMAIL: 'contactEmail',
  CONTACTPHONENUMBER: 'contactPhoneNumber',
  ADDRESS: 'address'
}

const OrganisationListFields = [
  OrganisationFields.ID,
  OrganisationFields.NAME,
  OrganisationFields.SLUG,
  OrganisationFields.IMG_URL,
  OrganisationFields.CATEGORY,
  OrganisationFields.GROUPS
]

const SchemaName = 'Organisation'

module.exports = {
  Category,
  OrganisationFields,
  OrganisationListFields,
  SchemaName
}
