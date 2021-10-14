import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { loadInterestFixtures, clearInterestFixtures, sessions } from './member.ability.fixture'
import { MemberStatus } from '../member.constants'

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
        .get('/api/members')
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
        .get(`/api/members/${context.fixtures.members[0]._id}`)
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
        .post('/api/members')
        .send({
          person: context.fixtures.people[0]._id,
          organisation: context.fixtures.organisations[0]._id,
          validation: 'Test validation',
          status: MemberStatus.JOINER
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
        .put(`/api/members/${context.fixtures.members[0]._id}`)
        .send({
          validation: 'Updated test validation'
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
      return request(server).delete(`/api/members/${context.fixtures.members[0]._id}`)
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
        .get('/api/members')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 2)
    }
  },
  {
    role: 'authenticated',
    action: 'read (own membership)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/members/${context.fixtures.members[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'authenticated',
    action: 'read (other\'s membership)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/members/${context.fixtures.members[2]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'authenticated',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/members')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          organisation: context.fixtures.organisations[0]._id,
          validation: 'Test validation',
          status: MemberStatus.JOINER
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'authenticated',
    action: 'create (invalid status)',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/members')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          organisation: context.fixtures.organisations[0]._id,
          validation: 'Test validation',
          status: MemberStatus.ORGADMIN
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'authenticated',
    action: 'create (for other user)',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/members')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          person: context.fixtures.people[2]._id,
          organisation: context.fixtures.organisations[0]._id,
          validation: 'Test validation',
          status: MemberStatus.JOINER
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'authenticated',
    action: 'update (own membership)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/members/${context.fixtures.members[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          status: MemberStatus.NONE
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'authenticated',
    action: 'update (own membership to org admin)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/members/${context.fixtures.members[0]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          status: MemberStatus.ORGADMIN
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'authenticated',
    action: 'update (other\'s membership)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/members/${context.fixtures.members[2]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          status: MemberStatus.NONE
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404)
    }
  },
  {
    role: 'authenticated',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/members/${context.fixtures.members[0]._id}`)
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
        .get('/api/members')
        .set('Cookie', [`idToken=${sessions[3].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 2)
    }
  },
  {
    role: 'org admin',
    action: 'read (own membership)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/members/${context.fixtures.members[0]._id}`)
        .set('Cookie', [`idToken=${sessions[3].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'org admin',
    action: 'read (other\'s membership)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/members/${context.fixtures.members[1]._id}`)
        .set('Cookie', [`idToken=${sessions[3].idToken}`])
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
        .post('/api/members')
        .set('Cookie', [`idToken=${sessions[3].idToken}`])
        .send({
          person: context.fixtures.people[2]._id,
          organisation: context.fixtures.organisations[0]._id,
          validation: 'Test validation',
          status: MemberStatus.MEMBER
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'org admin',
    action: 'create (other org)',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/members')
        .set('Cookie', [`idToken=${sessions[3].idToken}`])
        .send({
          person: context.fixtures.people[2]._id,
          organisation: context.fixtures.organisations[1]._id,
          validation: 'Test validation',
          status: MemberStatus.MEMBER
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'org admin',
    action: 'update (own membership)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/members/${context.fixtures.members[0]._id}`)
        .set('Cookie', [`idToken=${sessions[3].idToken}`])
        .send({
          status: MemberStatus.ORGADMIN
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'org admin',
    action: 'update (other\'s membership)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/members/${context.fixtures.members[1]._id}`)
        .set('Cookie', [`idToken=${sessions[3].idToken}`])
        .send({
          organisation: context.fixtures.organisations[0]._id,
          status: MemberStatus.ORGADMIN
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
        .delete(`/api/members/${context.fixtures.members[0]._id}`)
        .set('Cookie', [`idToken=${sessions[3].idToken}`])
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
        .get('/api/members')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 4)
    }
  },
  {
    role: 'admin',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/members/${context.fixtures.members[0]._id}`)
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
        .post('/api/members')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          person: context.fixtures.people[2]._id,
          organisation: context.fixtures.organisations[0]._id,
          validation: 'Test validation',
          status: MemberStatus.MEMBER
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
        .put(`/api/members/${context.fixtures.members[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          status: MemberStatus.NONE
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
        .delete(`/api/members/${context.fixtures.members[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  }
]

for (const { role, action, makeRequest, assertions } of testScenarios) {
  test.serial(`Member API - ${role} - ${action}`, async t => {
    const response = await makeRequest(t.context)

    assertions(t, response)
  })
}
