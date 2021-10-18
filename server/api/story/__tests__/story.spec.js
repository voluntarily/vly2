import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Story from '../story'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import stories from './story.fixture.js'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import { StoryStatus } from '../../story/story.constants'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before connecting to database', async (t) => {
  await appReady
  t.context.people = await Person.create(people)
  stories.forEach((story, index) => {
    story.author = t.context.people[index]._id
  })
  t.context.stories = await Story.create(stories)
})

test.serial('verify fixture database has stories', async t => {
  const count = await Story.countDocuments()
  t.is(count, t.context.stories.length)
  // Find all stories
  const p = await Story.find()
  t.is(t.context.stories.length, p.length)
  // Find stories by name
  const q = await Story.findOne({ name: 'Voluntarily wins Open Source Web prize' })
  t.is(q && q.status, 'published')
})

test.serial('Should give list of published stories', async t => {
  const res = await request(server)
    .get('/api/stories')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 1)
})

test.serial('Should correctly give list of all stories belonging to parent', async t => {
  const res = await request(server)
    .get('/api/stories/?parentId=5df0265916dc014f404ce0a0')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(1, got.length)
  t.is(got.parent, stories.parent)
})

test.serial('Get an invalid story id', async t => {
  const res = await request(server)
    .get(`/api/stories/${t.context.people[0]._id}`)
    .set('Accept', 'application/json')
    .expect(404)
  t.is(res.status, 404)
})

test.serial('Should not find invalid _id', async t => {
  const res = await request(server)
    .get('/api/stories/5ce8acae1fbf56001027b254')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
  t.is(res.status, 404)
})

test.only('Should correctly edit a story', async t => {
  const story1 = new Story({
    name: 'How to make a robot',
    description: 'To make a robot, you need to be a human.',
    status: StoryStatus.DRAFT,
    author: t.context.people[0]._id
  })
  await story1.save()
  const story2 = story1.toObject()
  story2.name = 'I am a robot'
  const res = await request(server)
    .put(`/api/stories/${story1._id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send(story2)
    .set('Accept', 'application/json')
  t.is(res.status, 200)
  t.is(res.body.name, story2.name)
})

test.serial('Should correctly delete a story', async t => {
  const story2 = new Story({
    name: 'Who are you?',
    body: 'Are you a human?',
    status: StoryStatus.PUBLISHED,
    author: t.context.people[0]._id
  })
  await story2.save()

  const res = await request(server)
    .delete(`/api/stories/${story2._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(res.status, 200)

  const queriedStory = await Story.findOne({ _id: story2._id }).exec()
  t.is(queriedStory, null)
})
