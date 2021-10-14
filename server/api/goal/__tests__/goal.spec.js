import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Goal from '../goal'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import goals from './goal.fixture.js'
import { GoalGroup } from '../goalGroup'

const testGoal = {
  name: 'Test Goal',
  slug: 'goal-test',
  subtitle: 'Test Subtitle',
  description: 'test goal description',
  language: 'en',
  imgUrl: '/static/img/goal/goal-complete-profile.png',
  startLink: '/test', // should be /profile#edit
  group: 'Test',
  evaluation: () => { return false }
}

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    await appReady
    t.context.goals = await Goal.create(goals).catch((e) => console.error('Unable to create goals', e))
  } catch (e) { console.error('goal.spec.js before error:', e) }
})

test.serial('verify fixture database has goals', async t => {
  const count = await Goal.countDocuments()
  t.is(count, goals.length)

  // can find by things
  await Goal.findOne({ slug: 'goal-complete-profile' }).then((goal) => {
    t.is(goal.name, 'Complete your profile')
  })

  await Goal.find().then((p) => {
    t.is(goals.length, p.length)
  })
})

test.serial('Should correctly give count of all goals sorted by rank', async t => {
  const res = await request(server)
    .get('/api/goals')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(goals.length, got.length)

  t.is(got[0].name, 'Complete your profile')
})

test.serial('Should handle bad JSON', async t => {
  t.plan(1)

  const res = await request(server)
    .get('/api/goals?q={"nocolon" "baddata"}')
    .set('Accept', 'application/json')
  t.is(res.status, 400)
})

test.serial('Should correctly give subset of goals matching slug', async t => {
  const res = await request(server)
    .get('/api/goals?q={"slug":"goal-complete-first-activity"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 1)
})

test.serial('Should find no matches', async t => {
  const res = await request(server)
    .get('/api/goals?q={"slug":"nomatches"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 0)
})

test.serial('Should fail to find - invalid query', async t => {
  const res = await request(server)
    .get('/api/goals?s={"invalid":"nomatches"}')
    .set('Accept', 'application/json')
    .expect(404)
  t.is(res.status, 404)
})

test.serial('Should fail to find - Bad request ', async t => {
  const res = await request(server)
    .get('/api/goals?s={this is not json}')
    .set('Accept', 'application/json')
    .expect(400)
  t.is(res.status, 400)
})

test.serial('Should correctly give reverse sorted goals of group', async t => {
  const res = await request(server)
    .get(`/api/goals?q={"group":"${GoalGroup.ORG_OP_NEW}"}&s="-name"`)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 3)
  t.is(got[0].slug, 'test-003')
})

const queryString = params => Object.keys(params).map((key) => {
  return key + '=' + params[key]
}).join('&')

test.serial('Should correctly select just the names and ids', async t => {
  const query = {
    q: JSON.stringify({ group: GoalGroup.VP_NEW }),
    p: 'slug imgUrl group'
  }
  const res = await request(server)
    .get(`/api/goals?${queryString(query)}`)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 3)
  t.is(got[0].name, undefined)
  t.is(got[0].slug, 'goal-complete-profile')
})

test.serial('Should send correct data when queried against an id', async t => {
  t.plan(1)

  const goal = new Goal(testGoal)
  await goal.save()
  const id = goal._id

  const res = await request(server)
    .get(`/api/goals/${id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  t.is(res.body.name, testGoal.name)
})
