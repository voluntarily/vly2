import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Goal from '../goal'
import MemoryMongo from '../../../util/test-memory-mongo'
import goals from './goal.fixture.js'

const testGoal = {
  name: 'Test Goal',
  slug: 'goal-test',
  subtitle: 'Test Subtitle',
  description: 'test goal description',
  language: 'en',
  imgUrl: '/static/img/goal/goal-complete-profile.png',
  startLink: '/test', // should be /profile#edit
  category: 'Test',
  evaluation: () => { return false }
}

const testGoalDefaults = {
  name: 'Test Goal',
  slug: 'goal-test-defaults',
  subtitle: 'Test Subtitle',
  description: 'test goal description',
  startLink: '/test', // should be /profile#edit
  category: 'Test',
  evaluation: () => { return false }
}

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    await appReady
    t.context.goals = await Goal.create(goals).catch((e) => console.error('Unable to create goals', e))
  } catch (e) { console.error('goal.spec.js before error:', e) }
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
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

test.serial('Should correctly give count of all goals sorted alpha', async t => {
  const res = await request(server)
    .get('/api/goals')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(goals.length, got.length)

  t.is(got[0].name, 'Complete first volunteering activity')
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
test.serial('Should correctly give subset of goals of category', async t => {
  const res = await request(server)
    .get('/api/goals?q={"category":"First Activity"}')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 1)
})

test.serial('Should correctly give reverse sorted goals of category', async t => {
  const res = await request(server)
    .get('/api/goals?q={"category":"Getting Started"}&s="-name"')
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 2)
  t.is(got[0].slug, 'goal-school-ready')
})

const queryString = params => Object.keys(params).map((key) => {
  return key + '=' + params[key]
}).join('&')

test.serial('Should correctly select just the names and ids', async t => {
  const query = {
    q: JSON.stringify({ category: 'Getting Started' }),
    p: 'slug imgUrl category'
  }
  const res = await request(server)
    .get(`/api/goals?${queryString(query)}`)
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
  const got = res.body
  t.is(got.length, 2)
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

test.serial('Should correctly add an goal', async t => {
  t.plan(4)
  const res = await request(server)
    .post('/api/goals')
    .send(testGoalDefaults)
    .set('Accept', 'application/json')
    .expect(200)

  try {
  // can find by id
    const id = res.body._id
    await Goal.findById(id).then((goal) => {
      t.is(id, goal._id.toString())
    })

    // can find by slug with then
    await Goal.findOne({ slug: testGoalDefaults.slug }).then((goal) => {
      t.is(goal.name, testGoalDefaults.name)
    })

    // can find by slug using await
    const saved = await Goal.findOne({ slug: testGoalDefaults.slug }).exec()
    t.is(saved.name, testGoalDefaults.name)

    // goal has been given the default image
    t.is(saved.imgUrl, '/static/img/goal/goal.png')
  } catch (err) {
    console.error(err)
  }
})

test.serial('Should load a goal into the db and delete them via the api', async t => {
  t.plan(2)

  const testGoalDelete = {
    name: 'Test Goal Delete',
    slug: 'test-goal-delete',
    category: 'Delete'
  }

  const goal = new Goal(testGoalDelete)
  await goal.save()
  const id = goal._id

  // check goal is there.
  const res = await request(server)
    .get(`/api/goals/${id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)

  t.is(res.body.name, testGoalDelete.name)

  // delete the record
  await request(server)
    .delete(`/api/goals/${goal._id}`)
    .set('Accept', 'application/json')
    .expect(200)

  // check goal is gone
  const q = await Goal.findOne({ slug: testGoalDelete.slug }).exec()
  t.is(q, null)
})
