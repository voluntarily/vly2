import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import { loadInterestFixtures, clearInterestFixtures, sessions } from './interestArchive.ability.fixture'
import { InterestStatus } from '../../interest/interest.constants'

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
        .get('/api/interestsArchived')
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
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
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
        .post('/api/interestsArchived')
        .send({
          person: context.fixtures.people[0]._id,
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          messages: [],
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
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .send({
          messages: [{ // this works whether its an object or array.
            body: 'Well done',
            author: context.fixtures.people[0]._id
          }],
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
      return request(server).delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
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
        .get('/api/interestsArchived')
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
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'volunteer',
    action: 'read (other\'s interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[1]._id}`)
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
        .post('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
        .send({
          person: context.fixtures.people[0]._id,
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          messages: [{ // this works whether its an object or array.
            body: 'Well done',
            author: context.fixtures.people[0]._id
          }],
          type: 'accept',
          status: InterestStatus.INTERESTED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'volunteer',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
        .send({
          messages: [{ // this works whether its an object or array.
            body: 'Well done',
            author: context.fixtures.people[0]._id
          }],
          type: 'message'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'volunteer',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[2].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'opportunity provider',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 2)
    }
  },
  {
    role: 'opportunity provider',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
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
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[2]._id}`)
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
        .post('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          messages: [{ // this works whether its an object or array.
            body: 'Create to opportunity provider',
            author: context.fixtures.people[0]._id
          }],
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
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          status: InterestStatus.ATTENDED,
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
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          status: InterestStatus.NOTATTENDED,
          type: 'accept'
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
        .delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'org admin',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 2)
    }
  },
  {
    role: 'org admin',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
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
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[2]._id}`)
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
        .post('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          messages: [{ // this works whether its an object or array.
            body: 'Create to org admin',
            author: context.fixtures.people[0]._id
          }],
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
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          messages: [{ // this works whether its an object or array.
            body: 'org admin - update (own interest)',
            author: context.fixtures.people[0]._id
          }],
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
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[4].idToken}`])
        .send({
          status: InterestStatus.INVITED,
          messages: [{ // this works whether its an object or array.
            body: 'org admin - update (other\'s interest)',
            author: context.fixtures.people[0]._id
          }],
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
        .delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
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
        .get('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 3)
    }
  },
  {
    role: 'admin',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
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
        .post('/api/interestsArchived')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          person: context.fixtures.people[1]._id,
          opportunity: context.fixtures.archivedOpportunities[0]._id,
          messages: [{ // this works whether its an object or array.
            body: 'admin create',
            author: context.fixtures.people[0]._id
          }],
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
        .put(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          status: InterestStatus.INVITED
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
        .delete(`/api/interestsArchived/${context.fixtures.archivedInterests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  }
]

for (const { role, action, makeRequest, assertions } of testScenarios) {
  test.serial(`Interest Archive API - ${role} - ${action}`, async t => {
    const response = await makeRequest(t.context)

    assertions(t, response)
  })
}
