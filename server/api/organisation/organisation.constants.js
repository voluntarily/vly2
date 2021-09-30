// const Category = {
//   VOLUNTEER_PROVIDER: 'vp',
//   OPPORTUNITY_PROVIDER: 'op',
//   ACTIVITY_PROVIDER: 'ap',
//   AGENCY: 'admin',
//   OTHER: 'other'
// }
export const SchemaName = 'Organisation'

export const OrganisationRole = {
  VOLUNTEER_PROVIDER: 'vp',
  OPPORTUNITY_PROVIDER: 'op',
  ACTIVITY_PROVIDER: 'ap',
  RESOURCE_PROVIDER: 'rp',
  AGENCY: 'agency', // can access reports
  SUPPORT: 'support', // can provide help desk support
  ADMIN: 'admin', // can be all powerful
  OTHER: 'other' // whats next
}

export const OrganisationFields = {
  NAME: 'name',
  SLUG: 'slug',
  IMGURL: 'imgUrl',
  WEBSITE: 'website',
  FACEBOOK: 'facebook',
  DOMAINNAME: 'domainName',
  TWITTER: 'twitter',
  ROLE: 'role',
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

export const OrganisationListFields = [
  OrganisationFields.ID,
  OrganisationFields.NAME,
  OrganisationFields.SLUG,
  OrganisationFields.IMG_URL,
  OrganisationFields.ROLE,
  OrganisationFields.GROUPS
]
