import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { loadInterestFixtures, clearInterestFixtures, sessions } from './school-lookup.ability.fixture'
import { SCHOOL_TYPES } from '../school-lookup.constants'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('setup database and app', async (t) => {
  await appReady
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
        .get('/api/schools')
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
        .get(`/api/schools/${context.fixtures.schools[0]._id}`)
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
        .post('/api/schools')
        .send({
          schoolId: 1234,
          emailDomain: 'example.com',
          schoolType: SCHOOL_TYPES.FULL_PRIMARY
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
        .put(`/api/schools/${context.fixtures.schools[0]._id}`)
        .send({
          name: 'Updated test name'
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
      return request(server).delete(`/api/schools/${context.fixtures.schools[0]._id}`)
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'authenticated',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/schools')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'authenticated',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/schools/${context.fixtures.schools[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'authenticated',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/schools')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          schoolId: 1234,
          emailDomain: 'example.com',
          schoolType: SCHOOL_TYPES.FULL_PRIMARY
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'authenticated',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/schools/${context.fixtures.schools[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          name: 'Updated test name'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'authenticated',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/schools/${context.fixtures.schools[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
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
        .get('/api/schools')
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
        .get(`/api/schools/${context.fixtures.schools[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'admin',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/schools')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          schoolId: 1234,
          emailDomain: 'example.com',
          schoolType: SCHOOL_TYPES.FULL_PRIMARY
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'admin',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/schools/${context.fixtures.schools[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          name: 'Updated test name'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'admin',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/schools/${context.fixtures.schools[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  }
]

for (const { role, action, makeRequest, assertions } of testScenarios) {
  test.serial(`School API - ${role} - ${action}`, async t => {
    const response = await makeRequest(t.context)

    assertions(t, response)
  })
}
