const { OpportunityStatus } = require('../opportunity.constants')
const { regions } = require('../../location/locationData')

module.exports = {
  opportunities: [
    {
      name: 'Test 2',
      type: 'ask',
      locations: [regions[0].containedTerritories[1]],
      status: OpportunityStatus.ACTIVE,
      tags: []
    },
    {
      name: 'Test 1',
      type: 'ask',
      locations: [regions[0].name],
      status: OpportunityStatus.ACTIVE,
      tags: []
    },
    {
      name: 'Test 3',
      type: 'ask',
      locations: [regions[0].containedTerritories[1]],
      status: OpportunityStatus.ACTIVE,
      tags: []
    },
    {
      name: 'Test 4',
      type: 'ask',
      locations: [regions[0].containedTerritories[2]],
      status: OpportunityStatus.ACTIVE,
      tags: []
    },
    {
      name: 'Test 5',
      type: 'ask',
      locations: [regions[2].name],
      status: OpportunityStatus.ACTIVE,
      tags: []
    }
  ],
  people: [
    {
      name: 'Testy McTestface',
      nickname: 'Testy',
      about: 'SUPPORT',
      locations: ['Planet Earth'],
      email: 'testy.mctestface@example.com',
      phone: '1234567',
      pronoun: { subject: 'they', object: 'them', possesive: 'their' },
      role: ['opportunityProvider'],
      status: 'active',
      tags: []
    }
  ],
  organisations: [],
  tagCategories: {
    technology: {
      tags: [
        'coding',
        'programming',
        'development',
        'java',
        'javascript',
        'react',
        'mongodb',
        'c++',
        'web',
        'web development',
        'mobile development',
        'websites',
        'technology',
        'cloud',
        'cloud-based',
        'file storage',
        'cybersecurity',
        'ict security',
        'infosec',
        'hacker',
        'hacking',
        'software'
      ]
    },
    business: {
      tags: [
        'business',
        'entrepreneurship',
        'commerce',
        'productivity',
        'planning',
        'collaboration',
        'agile',
        'meetings',
        'teamwork',
        'leadership',
        'messaging apps',
        'whatsapp',
        'phone apps',
        'apps',
        'zoom',
        'slack',
        'conference apps',
        'effective communication'
      ]
    }
  }
}
