import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { loadInterestFixtures, clearInterestFixtures, sessions, PERSON } from './interest.ability.fixture'
import { InterestStatus } from '../interest.constants'
import { InterestArchive } from '../interest'
import ArchivedOpportunity from '../../archivedOpportunity/archivedOpportunity'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('setup database and app', async (t) => {
  await appReady
})

test.beforeEach('populate database fixtures', async (t) => {
  t.context.fixtures = await loadInterestFixtures(InterestArchive, ArchivedOpportunity)
})

test.afterEach.always(async () => {
  await clearInterestFixtures(InterestArchive, ArchivedOpportunity)
})

const testScenarios = [
  {
    role: 'anon',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/interestArchives')
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
        .get(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
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
        .post('/api/interestArchives')
        .send({
          person: context.fixtures.people[0]._id,
          opportunity: context.fixtures.opportunities[0]._id,
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
        .put(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
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
      return request(server).delete(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
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
        .get('/api/interestArchives')
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 5)
    }
  },
  {
    role: 'volunteer',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
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
        .get(`/api/interestArchives/${context.fixtures.interests[1]._id}`)
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
        .post('/api/interestArchives')
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          person: context.fixtures.people[0]._id,
          opportunity: context.fixtures.opportunities[0]._id,
          messages: [{ // this works whether its an object or array.
            body: 'Well done',
            author: context.fixtures.people[PERSON.ADMIN]._id
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
        .put(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
        .send({
          messages: [{ // this works whether its an object or array.
            body: 'Well done',
            author: context.fixtures.people[PERSON.OP1]._id
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
        .delete(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VP1].idToken}`])
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
        .get('/api/interestArchives')
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 6)
    }
  },
  {
    role: 'opportunity provider',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
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
        .get(`/api/interestArchives/${context.fixtures.interests[2]._id}`)
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
        .post('/api/interestArchives')
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
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
        .put(`/api/interestArchives/${context.fixtures.interests[PERSON.OP1]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
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
    role: 'opportunity provider + activity provider',
    action: 'update (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestArchives/${context.fixtures.interests[9]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VPOPAP].idToken}`])
        .send({
          status: InterestStatus.NOTATTENDED,
          type: 'reject'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  },
  {
    role: 'opportunity provider + activity provider',
    action: 'update (others interest)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/interestArchives/${context.fixtures.interests[8]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.VPOPAP].idToken}`])
        .send({
          status: InterestStatus.NOTATTENDED,
          type: 'reject'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
    }
  },
  {
    role: 'opportunity provider',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.OP1].idToken}`])
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
        .get('/api/interestArchives')
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 8)
    }
  },
  {
    role: 'org admin',
    action: 'read (own interest)',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
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
        .get(`/api/interestArchives/${context.fixtures.interests[2]._id}`)
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
        .post('/api/interestArchives')
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
        .send({
          opportunity: context.fixtures.opportunities[0]._id,
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
        .put(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
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
        .put(`/api/interestArchives/${context.fixtures.interests[2]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
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
        .delete(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ORGADMIN].idToken}`])
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
        .get('/api/interestArchives')
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200)
      t.is(response.body.length, 10)
    }
  },
  {
    role: 'admin',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
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
        .post('/api/interestArchives')
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
        .send({
          person: context.fixtures.people[1]._id,
          opportunity: context.fixtures.opportunities[0]._id,
          messages: [{ // this works whether its an object or array.
            body: 'admin create',
            author: context.fixtures.people[0]._id
          }],
          type: 'accept',
          status: InterestStatus.ATTENDED
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
        .put(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
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
        .delete(`/api/interestArchives/${context.fixtures.interests[0]._id}`)
        .set('Cookie', [`idToken=${sessions[PERSON.ADMIN].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403)
    }
  }
]

for (const { role, action, makeRequest, assertions } of testScenarios) {
  test.serial(`Interest Archive API - ${role} - ${action}`, async t => {
    // leave comment in as it shows how to focus on one particular test
    // if (role === 'opportunity provider + activity provider' && action === 'update (others interest)') {
    const response = await makeRequest(t.context)
    assertions(t, response)
    // } else (t.pass())
  })
}
