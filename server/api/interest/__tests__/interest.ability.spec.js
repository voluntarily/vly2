import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { loadInterestFixtures, clearInterestFixtures, sessions, PERSON } from './interest.ability.fixture'
import { InterestStatus } from '../interest.constants'
import { Interest } from '../interest'
import Opportunity from '../../opportunity/opportunity'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('setup app', async (t) => {
  await appReady
})

test.beforeEach('populate database fixtures', async (t) => {
  t.context.fixtures = await loadInterestFixtures(Interest, Opportunity)
})

test.afterEach.always(async () => {
  await clearInterestFixtures(Interest, Opportunity)
})

const testScenarios = [
  {
    role: 'anon',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interests')
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'anon',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[0]._id}`)
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'anon',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interests')
        .send({
          person: context.fixtures.people[0]._id,
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment' }],
          status: InterestStatus.INTERESTED,
          termsAccepted: true
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'anon',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .send({
          message: [{ body: 'updated test comment' }],
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'anon',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server).delete(`/api/interests/${context.fixtures.interests[0]._id}`)
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'volunteer',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
    },
    assertions: (t, response) => {
      const expectedInterests = t.context.fixtures.interests
        .filter(interest => interest.person === t.context.fixtures.people[2]._id)

      t.is(response.statusCode, 200)
      t.is(response.body.length, expectedInterests.length)
    }
  },
  {
    role: 'volunteer',
    action: 'list (no interests)',
    makeRequest: async () => {
      return request(server)
        .get('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.VPAP].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 0)
    }
  },
  {
    role: 'volunteer',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'volunteer',
    action: 'read (others interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[1]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'volunteer',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment' }],
          termsAccepted: true
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'volunteer',
    action: 'create (invalid status)',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment' }],
          status: InterestStatus.INVITED,
          termsAccepted: true
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'volunteer',
    action: 'create (for other user)',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          person: context.fixtures.people[PERSON.VP2]._id,
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment' }],
          termsAccepted: true
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'volunteer',
    action: 'update message',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          messages: {
            body: 'Updated message',
            author: context.fixtures.people[2]
          },
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'volunteer',
    action: 'update (valid transition "invited" -> "committed")',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[5]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          status: InterestStatus.COMMITTED,
          messages: {
            body: 'Committed message',
            author: context.fixtures.people[2]
          },
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        200,
        'Volunteer should be able to move interest status from "invited" to "committed"'
      )
    }
  },
  {
    role: 'volunteer',
    action: 'update (valid transition "committed" -> "interested")',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[6]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          status: InterestStatus.INTERESTED,
          messages: {
            body: 'Committed message',
            author: context.fixtures.people[2]
          },
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        200,
        'Volunteer should be able to move interest status from "committed" to "interested"'
      )
    }
  },
  {
    role: 'volunteer',
    action: 'update (invalid transition "interested" -> "committed")',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          status: InterestStatus.COMMITTED,
          messages: {
            body: 'Committed message',
            author: context.fixtures.people[2]
          },
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        403,
        'Volunteer should not be able to move interest status from "interested" to "committed"'
      )
    }
  },
  {
    role: 'volunteer',
    action: 'delete (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'volunteer',
    action: 'delete (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interests/${context.fixtures.interests[1]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'opportunity provider',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
    },
    assertions: (t, response) => {
      const requestorOpportunityIds = t.context.fixtures.opportunities
        .filter(opportunity => opportunity.requestor === t.context.fixtures.people[PERSON.OP1]._id)
        .map(opportunity => opportunity._id)

      const expectedInterests = t.context.fixtures.interests
        .filter(interest => requestorOpportunityIds.includes(interest.opportunity))

      t.is(response.statusCode, 200)
      t.is(response.body.length, expectedInterests.length)
    }
  },
  {
    role: 'opportunity provider',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'opportunity provider',
    action: 'read (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'opportunity provider',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment' }],
          termsAccepted: true
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'opportunity provider',
    action: 'update (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          message: [{ body: 'Test comment' }],
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'opportunity provider',
    action: 'update (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
        .send({
          status: InterestStatus.INVITED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'opportunity provider',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'volunteer + opportunity provider',
    action: 'list',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests?meid=${context.fixtures.people[PERSON.VPOP]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VPOP].idToken}`])
    },
    assertions: (t, response) => {
      const expectedInterests = t.context.fixtures.interests
        .filter(interest => interest.person === t.context.fixtures.people[PERSON.VPOP]._id)

      const expectedInterestIds = expectedInterests.map(interest => interest._id.toString())

      t.is(response.statusCode, 200)
      t.is(response.body.length, expectedInterests.length)

      for (const actualInterest of response.body) {
        t.truthy(expectedInterestIds.includes(actualInterest._id.toString()))
      }
    }
  },
  {
    role: 'org admin',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
    },
    assertions: (t, response) => {
      const orgOpportunityIds = t.context.fixtures.opportunities
        .filter(opportunity => opportunity.offerOrg === t.context.fixtures.organisations[0]._id)
        .map(opportunity => opportunity._id)

      const expectedInterests = t.context.fixtures.interests
        .filter(interest => orgOpportunityIds.includes(interest.opportunity))

      t.is(response.statusCode, 200)
      t.is(response.body.length, expectedInterests.length)
    }
  },
  {
    role: 'org admin',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'org admin',
    action: 'read (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'org admin',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment' }],
          termsAccepted: true
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'org admin',
    action: 'update (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          message: [{ body: 'Test comment' }],
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'org admin',
    action: 'update (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          message: [{ body: 'Test comment' }],
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'org admin',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'admin',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, t.context.fixtures.interests.length)
    }
  },
  {
    role: 'admin',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'admin',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/interests')
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
        .send({
          person: context.fixtures.people[PERSON.OP1]._id,
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment' }],
          status: InterestStatus.INVITED,
          termsAccepted: true
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'admin',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          message: [{ body: 'Test comment' }],
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'admin',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  }
]

for (const { role, action, makeRequest, assertions, only } of testScenarios) {
  const testName = `Interest API - ${role} - ${action}`
  const testFunction = async t => {
    const response = await makeRequest(t.context)

    assertions(t, response)
  }

  if (only) {
    test.serial.only(testName, testFunction)
  } else {
    test.serial(testName, testFunction)
  }
}
