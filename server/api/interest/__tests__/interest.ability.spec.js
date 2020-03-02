import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import { loadInterestFixtures, clearInterestFixtures, sessions } from './interest.ability.fixture'
import { InterestStatus } from '../interest.constants'
import mongoose from 'mongoose'

const ObjectId = mongoose.Types.ObjectId

test.before('setup database and app', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('populate database fixtures', async (t) => {
  t.context.fixtures = await loadInterestFixtures()
})

test.afterEach.always(async () => {
  await clearInterestFixtures()
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
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
          type: 'accept',
          status: InterestStatus.INTERESTED
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
          message: [{ body: 'updated test comment', author: context.fixtures.people[0]._id }],
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
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 1)
    }
  },
  {
    role: 'volunteer',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
          type: 'accept'
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
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
          type: 'accept',
          status: InterestStatus.INVITED
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
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
        .send({
          person: context.fixtures.people[3]._id,
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
          type: 'accept'
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
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
        .send({
          messages: {
            body: 'Updated message',
            author: ObjectId()
          },
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    // a volunteer can change status to COMMITTED
    role: 'volunteer',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
        .send({
          status: InterestStatus.COMMITTED,
          messages: {
            body: 'Committed message',
            author: ObjectId()
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
    action: 'delete (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      const expectedInterests = t.context.fixtures.interests
        .filter(interest => interest.opportunity === t.context.fixtures.opportunities[0]._id)

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
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'opportunity provider',
    action: 'update (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
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
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'volunteer + opportunity provider',
    action: 'list',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interests?meid=${context.fixtures.people[6]._id}`)
        .set('Cookie', [`idToken=${sessions[6].idToken}`])
    },
    assertions: (t, response) => {
      const expectedInterests = t.context.fixtures.interests
        .filter(interest => interest.person === t.context.fixtures.people[6]._id)

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
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
    },
    assertions: (t, response) => {
      const expectedInterests = t.context.fixtures.interests
        .filter(interest => interest.opportunity === t.context.fixtures.opportunities[0]._id)

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
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
          type: 'accept'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'org admin',
    action: 'update (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interests/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
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
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
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
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'admin',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interests')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
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
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          person: context.fixtures.people[1]._id,
          opportunity: context.fixtures.opportunities[0]._id,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
          type: 'accept',
          status: InterestStatus.INVITED
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
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          message: [{ body: 'Test comment', author: context.fixtures.people[0]._id }],
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
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  }
]

for (const { role, action, makeRequest, assertions } of testScenarios) {
  test.serial(`Interest API - ${role} - ${action}`, async t => {
    const response = await makeRequest(t.context)

    assertions(t, response)
  })
}
