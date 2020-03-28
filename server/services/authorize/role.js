const Role = {
  ANON: 'anonymous',
  ALL: 'all',
  VOLUNTEER: 'volunteer',
  OPPORTUNITY_PROVIDER: 'opportunityProvider',
  ACTIVITY_PROVIDER: 'activityProvider',
  RESOURCE_PROVIDER: 'resourceProvider',
  TESTER: 'tester',
  ADMIN: 'admin',
  ORG_ADMIN: 'orgAdmin'
}

const OrganisationRole = {
  VOLUNTEER_PROVIDER: 'volunteerProvider',
  OPPORTUNITY_PROVIDER: 'opportunityProvider',
  ACTIVITY_PROVIDER: 'activityProvider',
  RESOURCE_PROVIDER: 'resourceProvider',
  AGENCY: 'agency', // can access reports
  SUPPORT: 'support', // can provide help desk support
  ADMIN: 'admin'
}

module.exports = {
  Role
}
