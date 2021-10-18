import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import Activity from '../activity'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import acts from './activity.fixture.js'
import Member from '../../member/member'
import { MemberStatus } from '../../member/member.constants'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import Organisation from '../../organisation/organisation'
import orgs from '../../organisation/__tests__/organisation.fixture'
import tagList from '../../tag/__tests__/tag.fixture'
import { jwtData, jwtDataAlice, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  await appReady
})

test.beforeEach('connect and add two activity entries', async (t) => {
  // connect each activity to an owner and org
  [t.context.people, t.context.orgs] = await Promise.all([
    Person.create(people),
    Organisation.create(orgs)
  ])

  acts.forEach((act, index) => {
    act.owner = t.context.people[index]._id
    act.offerOrg = t.context.orgs[index]._id
    // each act has two consecutive tags from the list
    act.tags = [tagList[index], tagList[index + 1]]
  })

  const draftDaliActivity = {
    name: 'Test draft activity 5',
    subtitle: 'Subtitle',
    description: 'Description',
    duration: '2 hours',
    equipment: ['single item'],
    status: 'draft',
    owner: t.context.people[1]._id,
    offerOrg: t.context.orgs[1]._id,
    tags: [tagList[1], tagList[2]]
  }

  t.context.activities = await Activity.create(acts.concat([draftDaliActivity]))
})

test.afterEach.always(async () => {
  await Promise.all([
    Activity.deleteMany(),
    Member.deleteMany(),
    Organisation.deleteMany(),
    Person.deleteMany()
  ])
})

test.serial('Activity API - anon - list', async t => {
  const response = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')

  const actualActivities = response.body
  const expectedActivities = t.context.activities.filter(activity => activity.status === 'active')

  t.is(response.statusCode, 200)
  t.is(actualActivities.length, expectedActivities.length)
})

test.serial('Activity API - anon - create', async t => {
  const response = await request(server)
    .post('/api/activities')
    .send({
      name: 'Test activity name',
      subtitle: 'Subtitle',
      description: 'Description',
      duration: 'Duration',
      status: 'active',
      offerOrg: t.context.orgs[0]._id,
      owner: t.context.people[0]._id
    })

  t.is(response.statusCode, 403)
})

test.serial('Activity API - anon - read (active)', async t => {
  const activeActivity = t.context.activities
    .filter(activity => activity.status === 'active')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${activeActivity._id}`)
    .set('Accept', 'application/json')

  t.is(response.statusCode, 200)
})

test.serial('Activity API - anon - read (draft)', async t => {
  const draftActivity = t.context.activities
    .filter(activity => activity.status === 'draft')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${draftActivity._id}`)
    .set('Accept', 'application/json')

  t.is(response.statusCode, 404)
})

test.serial('Activity API - anon - update', async t => {
  const activity = t.context.activities[0]

  const response = await request(server)
    .put(`/api/activities/${activity._id}`)
    .send({
      name: `Updated ${activity.name}`
    })

  t.is(response.statusCode, 403)
})

test.serial('Activity API - anon - delete', async t => {
  const activity = t.context.activities[0]

  const response = await request(server)
    .delete(`/api/activities/${activity._id}`)

  t.is(response.statusCode, 403)
})

test.serial('Activity API - admin - list', async t => {
  const response = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  const actualActivities = response.body
  const expectedActivities = t.context.activities

  t.is(response.statusCode, 200)
  t.is(actualActivities.length, expectedActivities.length)
})

test.serial('Activity API - admin - create', async t => {
  const response = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      name: 'Test activity name',
      subtitle: 'Subtitle',
      description: 'Description',
      duration: 'Duration',
      status: 'active',
      offerOrg: t.context.orgs[0]._id,
      owner: t.context.people[0]._id
    })

  t.is(response.statusCode, 200)
})

test.serial('Activity API - admin - read (active)', async t => {
  const activeActivity = t.context.activities
    .filter(activity => activity.status === 'active')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${activeActivity._id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .set('Accept', 'application/json')

  t.is(response.statusCode, 200)
})

test.serial('Activity API - admin - read (draft)', async t => {
  const draftActivity = t.context.activities
    .filter(activity => activity.status === 'draft')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${draftActivity._id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .set('Accept', 'application/json')

  t.is(response.statusCode, 200)
})

test.serial('Activity API - admin - update', async t => {
  const activity = t.context.activities[0]

  const response = await request(server)
    .put(`/api/activities/${activity._id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      name: `Updated ${activity.name}`
    })

  t.is(response.statusCode, 200)
})

test.serial('Activity API - admin - delete', async t => {
  const activity = t.context.activities[0]

  const response = await request(server)
    .delete(`/api/activities/${activity._id}`)
    .set('Cookie', [`idToken=${jwtData.idToken}`])

  t.is(response.statusCode, 200)
})

test.serial('Activity API - volunteer/op - list', async t => {
  const response = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])

  const actualActivities = response.body
  const expectedActivities = t.context.activities.filter(activity => activity.status === 'active')

  t.is(response.statusCode, 200)
  t.is(actualActivities.length, expectedActivities.length)
})

test.serial('Activity API - volunteer/op - create', async t => {
  const response = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
    .send({
      name: 'Test activity name',
      subtitle: 'Subtitle',
      description: 'Description',
      duration: 'Duration',
      status: 'active',
      offerOrg: t.context.orgs[0]._id,
      owner: t.context.people[0]._id
    })

  t.is(response.statusCode, 403)
})

test.serial('Activity API - volunteer/op - read (active)', async t => {
  const activeActivity = t.context.activities
    .filter(activity => activity.status === 'active')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${activeActivity._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])

  t.is(response.statusCode, 200)
})

test.serial('Activity API - volunteer/op - read (draft)', async t => {
  const draftActivity = t.context.activities
    .filter(activity => activity.status === 'draft')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${draftActivity._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])

  t.is(response.statusCode, 404)
})

test.serial('Activity API - volunteer/op - update', async t => {
  const activity = t.context.activities[0]

  const response = await request(server)
    .put(`/api/activities/${activity._id}`)
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
    .send({
      name: `Updated ${activity.name}`
    })

  t.is(response.statusCode, 403)
})

test.serial('Activity API - volunteer/op - delete', async t => {
  const activity = t.context.activities[0]

  const response = await request(server)
    .delete(`/api/activities/${activity._id}`)
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])

  t.is(response.statusCode, 403)
})

test.serial('Activity API - ap - list', async t => {
  const owner = t.context.people[1]

  const response = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  const actualActivities = response.body
  const expectedActivities = t.context.activities.filter(activity => {
    return (
      activity.status === 'active' || activity.owner === owner._id
    )
  })

  t.is(response.statusCode, 200)
  t.is(actualActivities.length, expectedActivities.length)
})

test.serial('Activity API - ap - create', async t => {
  const response = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
    .send({
      name: 'Test activity name',
      subtitle: 'Subtitle',
      description: 'Description',
      duration: 'Duration',
      status: 'active',
      offerOrg: t.context.orgs[1]._id,
      owner: t.context.people[1]._id
    })

  t.is(response.statusCode, 200)
})

test.serial('Activity API - ap - read (active)', async t => {
  const activeActivity = t.context.activities
    .filter(activity => activity.status === 'active')
    .pop()

  const response = await request(server)
    .get(`/api/activities/${activeActivity._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  t.is(response.statusCode, 200)
})

test.serial('Activity API - ap - read (draft + not owner)', async t => {
  const loggedInActivityProvider = t.context.people[1]

  const draftActivity = t.context.activities
    .filter(activity => {
      return (
        activity.status === 'draft' && activity.owner !== loggedInActivityProvider._id
      )
    })
    .pop()

  const response = await request(server)
    .get(`/api/activities/${draftActivity._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  t.is(response.statusCode, 404)
})

test.serial('Activity API - ap - read (draft + owner)', async t => {
  const loggedInActivityProvider = t.context.people[1]

  const draftActivity = t.context.activities
    .filter(activity => {
      return (
        activity.status === 'draft' && activity.owner === loggedInActivityProvider._id
      )
    })
    .pop()

  const response = await request(server)
    .get(`/api/activities/${draftActivity._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

  t.is(response.statusCode, 200)
})

test.serial('Activity API - ap - update (owned)', async t => {
  const loggedInActivityProvider = t.context.people[1]

  const ownedActivities = t.context.activities
    .filter(activity => activity.owner === loggedInActivityProvider._id)

  for (const ownedActivity of ownedActivities) {
    const response = await request(server)
      .put(`/api/activities/${ownedActivity._id}`)
      .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
      .send({
        name: `Updated ${ownedActivity.name}`
      })

    t.is(response.statusCode, 200)
  }
})

test.serial('Activity API - ap - update (not owned)', async t => {
  const loggedInActivityProvider = t.context.people[1]

  const notOwnedActivities = t.context.activities
    .filter(activity => activity.owner !== loggedInActivityProvider._id)

  for (const notOwnedActivity of notOwnedActivities) {
    const response = await request(server)
      .put(`/api/activities/${notOwnedActivity._id}`)
      .set('Cookie', [`idToken=${jwtDataDali.idToken}`])
      .send({
        name: `Updated ${notOwnedActivity.name}`
      })

    t.is(response.statusCode, 403)
  }
})

test.serial('Activity API - ap - delete', async t => {
  const activities = t.context.activities

  for (const activity of activities) {
    const response = await request(server)
      .delete(`/api/activities/${activity._id}`)
      .set('Cookie', [`idToken=${jwtDataDali.idToken}`])

    t.is(response.statusCode, 403)
  }
})

test.serial('Activity API - org admin - list', async t => {
  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const response = await request(server)
    .get('/api/activities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])

  const actualActivities = response.body
  const expectedActivities = t.context.activities.filter(activity => {
    return (
      activity.status === 'active' || activity.offerOrg === org._id
    )
  })

  t.is(response.statusCode, 200)
  t.is(actualActivities.length, expectedActivities.length)
})

test.serial('Activity API - org admin - create (valid org + owner)', async t => {
  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const response = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
    .send({
      name: 'Test activity name',
      subtitle: 'Subtitle',
      description: 'Description',
      duration: 'Duration',
      status: 'active',
      offerOrg: org._id,
      owner: orgAdmin._id
    })

  t.is(response.statusCode, 200)
})

test.serial('Activity API - org admin - create (valid org + invalid owner)', async t => {
  // at this point I've assumed that the org admin can only
  // create activities where they are the owner
  // (they can't create on behalf of other people)
  const invalidOwner = t.context.people[1]

  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const response = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
    .send({
      name: 'Test activity name',
      subtitle: 'Subtitle',
      description: 'Description',
      duration: 'Duration',
      status: 'active',
      offerOrg: org._id,
      owner: invalidOwner._id
    })

  t.is(response.statusCode, 403)
})

test.serial('Activity API - org admin - create (invalid org + invalid owner)', async t => {
  const invalidOrg = t.context.orgs[2]
  const invalidOwner = t.context.people[1]

  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const response = await request(server)
    .post('/api/activities')
    .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
    .send({
      name: 'Test activity name',
      subtitle: 'Subtitle',
      description: 'Description',
      duration: 'Duration',
      status: 'active',
      offerOrg: invalidOrg._id,
      owner: invalidOwner._id
    })

  t.is(response.statusCode, 403)
})

test.serial('Activity API - org admin - read (active/org admin)', async t => {
  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const readableActivities = t.context.activities
    .filter(activity => activity.status === 'active' || activity.offerOrg === org._id)

  for (const readableActivity of readableActivities) {
    const response = await request(server)
      .get(`/api/activities/${readableActivity._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])

    t.is(response.statusCode, 200)
  }
})

test.serial('Activity API - org admin - read (draft/not org admin)', async t => {
  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const unreadableActivities = t.context.activities
    .filter(activity => activity.status === 'draft' && activity.offerOrg !== org._id)

  for (const unreadableActivity of unreadableActivities) {
    const response = await request(server)
      .get(`/api/activities/${unreadableActivity._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])

    t.is(response.statusCode, 404)
  }
})

test.serial('Activity API - org admin - update (org admin)', async t => {
  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const ownedActivities = t.context.activities
    .filter(activity => activity.offerOrg === org._id)

  for (const ownedActivity of ownedActivities) {
    const response = await request(server)
      .put(`/api/activities/${ownedActivity._id}`)
      .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
      .send({
        name: `Updated ${ownedActivity.name}`
      })

    t.is(response.statusCode, 200)
  }
})

test.serial('Activity API - org admin - update (not org admin)', async t => {
  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const notOwnedActivities = t.context.activities
    .filter(activity => activity.offerOrg !== org._id)

  for (const notOwnedActivity of notOwnedActivities) {
    const response = await request(server)
      .put(`/api/activities/${notOwnedActivity._id}`)
      .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])
      .send({
        name: `Updated ${notOwnedActivity.name}`
      })

    t.is(response.statusCode, 403)
  }
})

test.serial('Activity API - org admin - delete', async t => {
  const orgAdmin = t.context.people[2]
  const org = t.context.orgs[1]

  await Member.create({
    person: orgAdmin._id,
    organisation: org._id,
    status: MemberStatus.ORGADMIN
  })

  const activities = t.context.activities

  for (const activity of activities) {
    const response = await request(server)
      .delete(`/api/activities/${activity._id}`)
      .set('Cookie', [`idToken=${jwtDataAlice.idToken}`])

    t.is(response.statusCode, 403)
  }
})
