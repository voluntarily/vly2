import { OrganisationRole } from '../../organisation/organisation.constants'

module.exports = {
  people: [
    {
      name: 'Test name 1',
      email: 'test1@example.com'
    },
    {
      name: 'Test name 2',
      email: 'test2@example.com'
    },
    {
      name: 'System Admin hard coded',
      email: 'admin3@example.com',
      role: ['admin']
    },
    {
      name: 'Member of None',
      email: 'test4@example.com'
    },
    {
      name: 'Classic Volunteer',
      email: 'test5@example.com'
    }

  ],
  organisations: [
    {
      name: 'Test organisation 1',
      slug: 'test-org-1',
      role: OrganisationRole.VOLUNTEER_PROVIDER
    },
    {
      name: 'Test organisation 2',
      slug: 'test-org-2',
      role: OrganisationRole.ACTIVITY_PROVIDER
    },
    {
      name: 'Test organisation 3',
      slug: 'test-org-3',
      role: OrganisationRole.OPPORTUNITY_PROVIDER

    },
    {
      name: 'Test organisation 4',
      slug: 'test-org-4',
      role: OrganisationRole.ADMIN

    }
  ]
}
