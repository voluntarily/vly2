const { OpportunityStatus } = require('../opportunity.constants')
const { regions } = require('../../location/locationData')

module.exports = {
  opportunities: [
    {
      name: 'Test 2',
      location: regions[0].containedTerritories[1],
      status: OpportunityStatus.ACTIVE,
      tags: []
    },
    {
      name: 'Test 1',
      location: regions[0].name,
      status: OpportunityStatus.ACTIVE,
      tags: []
    },
    {
      name: 'Test 3',
      location: regions[0].containedTerritories[1],
      status: OpportunityStatus.ACTIVE,
      tags: []
    },
    {
      name: 'Test 4',
      location: regions[0].containedTerritories[2],
      status: OpportunityStatus.ACTIVE,
      tags: []
    },
    {
      name: 'Test 5',
      location: regions[2].name,
      status: OpportunityStatus.ACTIVE,
      tags: []
    }
  ],
  people: [
    {
      name: 'Testy McTestface',
      nickname: 'Testy',
      about: 'SUPPORT',
      location: 'Planet Earth',
      email: 'testy.mctestface@example.com',
      phone: '1234567',
      pronoun: { subject: 'they', object: 'them', possesive: 'their' },
      role: ['opportunityProvider'],
      status: 'active',
      tags: []
    }
  ],
  organisations: []
}
