import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { loadInterestFixtures, clearInterestFixtures, sessions } from './story.ability.fixture'
import { StoryStatus } from '../story.constants'

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
        .get('/api/stories')
    },
    assertions: (t, response) => {
      const expectedStories = t.context.fixtures.stories.filter(story => story.status === StoryStatus.PUBLISHED)

      t.is(response.statusCode, 200, 'Anonymous users should be able to list stories')
      t.is(response.body.length, expectedStories.length, 'Anonymous users should be able to list all stories that are published')
    }
  },
  {
    role: 'anon',
    action: 'read (published)',
    makeRequest: async (context) => {
      const storyId = context.fixtures.stories
        .filter(story => story.status === StoryStatus.PUBLISHED)[0]._id

      return request(server)
        .get(`/api/stories/${storyId}`)
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200, 'Anonymous users should be able to read all stories that are published')
    }
  },
  {
    role: 'anon',
    action: 'read (draft)',
    makeRequest: async (context) => {
      const storyId = context.fixtures.stories
        .filter(story => story.status === StoryStatus.DRAFT)[0]._id

      return request(server)
        .get(`/api/stories/${storyId}`)
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 404, 'Anonymous users should not be able to read stories that are draft')
    }
  },
  {
    role: 'anon',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/stories')
        .send({
          name: 'Test create',
          status: StoryStatus.PUBLISHED
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403, 'Anonymous users should not be able to create stories')
    }
  },
  {
    role: 'anon',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/stories/${context.fixtures.stories[0]._id}`)
        .send({
          name: 'Updated test name'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403, 'Anonymous users should not be able to update stories')
    }
  },
  {
    role: 'anon',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server).delete(`/api/stories/${context.fixtures.stories[0]._id}`)
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 403, 'Anonymous users should not be able to delete stories')
    }
  },
  {
    role: 'authenticated',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/stories')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      const expectedStories = t.context.fixtures.stories
        .filter(story => {
          return (
            story.status === StoryStatus.PUBLISHED ||
            story.author === t.context.fixtures.people[1]._id
          )
        })

      t.is(response.statusCode, 200, 'Authenticated users should be able to list stories')
      t.is(
        response.body.length,
        expectedStories.length,
        'Authenticated users should be able to list all published stories and their own drafts'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'read (published, no author)',
    makeRequest: async (context) => {
      const storyId = context.fixtures.stories
        .filter(story => {
          return (
            story.status === StoryStatus.PUBLISHED &&
            !story.author
          )
        })[0]._id

      return request(server)
        .get(`/api/stories/${storyId}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200, 'Authenticated users should be able to read any published story')
    }
  },
  {
    role: 'authenticated',
    action: 'read (draft, author)',
    makeRequest: async (context) => {
      const storyId = context.fixtures.stories
        .filter(story => {
          return (
            story.status === StoryStatus.DRAFT &&
            story.author === context.fixtures.people[1]._id
          )
        })[0]._id

      return request(server)
        .get(`/api/stories/${storyId}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        200,
        'Authenticated users should be able to read draft stories where they are the author'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'read (draft, no author)',
    makeRequest: async (context) => {
      const storyId = context.fixtures.stories
        .filter(story => {
          return (
            story.status === StoryStatus.DRAFT &&
            !story.author
          )
        })[0]._id

      return request(server)
        .get(`/api/stories/${storyId}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        404,
        'Authenticated users should not be able to read other people\'s draft stories'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'create (valid)',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/stories')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          name: 'Test create',
          author: context.fixtures.people[1]._id,
          status: StoryStatus.DRAFT
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        200,
        'Authenticated users should be able to create their own stories'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'create (invalid author)',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/stories')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          name: 'Test create',
          author: context.fixtures.people[2]._id,
          status: StoryStatus.DRAFT
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        403,
        'Authenticated users should not be able to create stories for other people'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'create (invalid status)',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/stories')
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          name: 'Test create',
          author: context.fixtures.people[1]._id,
          status: StoryStatus.DELETED
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        403,
        'Authenticated users should not be able to create stories with deleted status'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/stories/${context.fixtures.stories[3]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          name: 'Updated test name'
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        200,
        'Authenticated user should be able to update their own stories'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'update (invalid author)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/stories/${context.fixtures.stories[3]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          author: context.fixtures.people[0]._id
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        404,
        'Authenticated user should not be able to update story to have a different author'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'update (other person\'s story)',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/stories/${context.fixtures.stories[4]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
        .send({
          name: 'Updated test name'
        })
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        404,
        'Authenticated user should not be able to update another person\'s story'
      )
    }
  },
  {
    role: 'authenticated',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/stories/${context.fixtures.stories[3]._id}`)
        .set('Cookie', [`idToken=${sessions[1].idToken}`])
    },
    assertions: (t, response) => {
      t.is(
        response.statusCode,
        403,
        'Authenticated user should not be able to delete stories'
      )
    }
  },
  {
    role: 'admin',
    action: 'list',
    makeRequest: async () => {
      return request(server)
        .get('/api/stories')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200, 'Admin should be able to list stories')
      t.is(response.body.length, t.context.fixtures.stories.length, 'Admin should be able to list all stories')
    }
  },
  {
    role: 'admin',
    action: 'read',
    makeRequest: async (context) => {
      return request(server)
        .get(`/api/stories/${context.fixtures.stories[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200, 'Admin should be able to read all stories')
    }
  },
  {
    role: 'admin',
    action: 'create',
    makeRequest: async (context) => {
      return request(server)
        .post('/api/stories')
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          name: 'Test create',
          status: StoryStatus.PUBLISHED,
          author: context.fixtures.people[1]._id
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200, 'Admin should be able to create stories')
    }
  },
  {
    role: 'admin',
    action: 'update',
    makeRequest: async (context) => {
      return request(server)
        .put(`/api/stories/${context.fixtures.stories[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
        .send({
          name: 'Updated test name'
        })
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200, 'Admin should be able to update all stories')
    }
  },
  {
    role: 'admin',
    action: 'delete',
    makeRequest: async (context) => {
      return request(server)
        .delete(`/api/stories/${context.fixtures.stories[0]._id}`)
        .set('Cookie', [`idToken=${sessions[0].idToken}`])
    },
    assertions: (t, response) => {
      t.is(response.statusCode, 200, 'Admin should be able to delete all stories')
    }
  }
]

for (const { role, action, makeRequest, assertions } of testScenarios) {
  test.serial(`Story API - ${role} - ${action}`, async t => {
    const response = await makeRequest(t.context)

    assertions(t, response)
  })
}
