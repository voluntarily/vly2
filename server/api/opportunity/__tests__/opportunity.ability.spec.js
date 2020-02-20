import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../person/person'
import Tag from '../../tag/tag'
import Opportunity from '../opportunity'
import { OpportunityStatus, OpportunityFields, OpportunityPublishedStatus } from '../opportunity.constants'
import people from '../../person/__tests__/person.fixture'
import ops from './opportunity.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'
import { ObjectId } from 'mongodb'
import jsonwebtoken from 'jsonwebtoken'
import { jwtData } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import uuid from 'uuid'
import { Role } from '../../../services/authorize/role'

const createJwtIdToken = (email) => {
  const jwt = { ...jwtData }
  jwt.idTokenPayload.email = email

  return jsonwebtoken.sign(jwt.idTokenPayload, 'secret')
}

const createPerson = (roles) => {
  // Create a new user in the database directly
  const person = {
    name: 'name',
    email: `${uuid()}@test.com`,
    role: roles || [],
    status: 'active'
  }

  return Person.create(person)
}

const createPersonAndGetToken = async (roles) => {
  const user = await createPerson(roles)

  if (!roles) {
    return undefined
  } else {
    // Create a JWT token to use in our HTTP header
    return createJwtIdToken(user.email)
  }
}

const assertContainsOnlyAnonymousFields = (test, obj) => {
  const permittedFields = [
    OpportunityFields.ID,
    OpportunityFields.NAME,
    OpportunityFields.SUBTITLE,
    OpportunityFields.IMG_URL,
    OpportunityFields.DURATION
  ]
  for (const key of Object.keys(obj)) {
    test.true(permittedFields.includes(key), `The response contained an invalid field: '${key}'`)
  }
}

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
  t.context.people = await Person.create(people)
  t.context.tags = await Tag.create({ tags })
  for (let index = 0; index < ops.length; index++) {
    ops[index].requestor = t.context.people[index]._id
  }
  t.context.opportunities = await Opportunity.create(ops)
})

test.serial('Anonymous - READ by id', async t => {
  const res = await request(server)
    .get(`/api/opportunities/${t.context.opportunities[0]._id}`)
    .set('Accept', 'application/json')

  t.is(200, res.status)
  assertContainsOnlyAnonymousFields(t, res.body)
})

test.serial('Anonymous users should receive 404 from GET by ID endpoint if draft', async t => {
  const res = await request(server)
    .get(`/api/opportunities/${t.context.opportunities.filter(op => op.status === OpportunityStatus.DRAFT)[0]._id}`)
    .set('Accept', 'application/json')
  t.is(404, res.status)
})

test.serial('Anonymous - LIST', async t => {
  const res = await request(server)
    .get('/api/opportunities')
    .set('Accept', 'application/json')

  t.is(200, res.status)
  for (const op of res.body) {
    assertContainsOnlyAnonymousFields(t, op)
  }
})

test.serial('Anonymous users should only receive active ops from GET all endpoint', async t => {
  const res = await request(server)
    .get('/api/opportunities')
    .set('Accept', 'application/json')

  const resIds = res.body.map(op => op._id)

  // Get ACTIVE ops from the database (for the IDs in the response)
  const activeOpsForIds = await Opportunity.find(
    {
      _id: {
        $in: resIds.map(id => new ObjectId(id))
      },
      status: OpportunityStatus.ACTIVE
    }
  )

  t.is(res.body.length, activeOpsForIds.length)
})

test.serial('Anonymous - CREATE is denied', async t => {
  const res = await request(server)
    .post('/api/opportunities')
    .set('Accept', 'application/json')
    .send({})

  t.is(403, res.status)
})

test.serial('Anonymous - UPDATE is denied', async t => {
  const id = t.context.opportunities[0]._id

  const res = await request(server)
    .put(`/api/opportunities/${id}`)
    .set('Accept', 'application/json')
    .send({})

  t.is(403, res.status)
})

test.serial('Anonymous - DELETE is denied', async t => {
  const id = t.context.opportunities[0]._id

  const res = await request(server)
    .delete(`/api/opportunities/${id}`)
    .set('Accept', 'application/json')

  t.is(403, res.status)
})

for (const role of [Role.VOLUNTEER_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER]) {
  test.serial(`${role} - LIST - get all published`, async t => {
    const q = {
      status: {
        $in: OpportunityPublishedStatus
      }
    }

    const res = await request(server)
      .get(`/api/opportunities?q=${JSON.stringify(q)}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])

    t.is(200, res.status)
    t.is(3, res.body.length) // There are 3 published (i.e. ACTIVE or COMPLETED) ops in the fixture file
    t.truthy(res.body.find(op => op.name === '1 Mentor a year 12 business Impact Project'))
    t.truthy(res.body.find(op => op.name === '2 Self driving model cars'))
    t.truthy(res.body.find(op => op.name === '6 Building a race car'))
  })

  test.serial(`${role} - LIST - unauthorized status records are trimmed`, async t => {
    // Make sure there are DRAFT ops before the test
    t.true((await Opportunity.find({ status: OpportunityStatus.DRAFT })).length > 0)

    const q = {
      status: {
        $in: [OpportunityStatus.ACTIVE, OpportunityStatus.DRAFT] // Volunteers are not allowed to list DRAFT ops
      }
    }

    const res = await request(server)
      .get(`/api/opportunities?q=${JSON.stringify(q)}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.VOLUNTEER_PROVIDER])}`])

    t.is(200, res.status)
    t.is(2, res.body.length) // There are 2 ACTIVE ops in the fixture file
    t.truthy(res.body.find(op => op.name === '1 Mentor a year 12 business Impact Project'))
    t.truthy(res.body.find(op => op.name === '2 Self driving model cars'))
    // DRAFT ops will have been trimmed from the response
  })

  test.serial(`${role} - READ - can read ACTIVE status`, async t => {
    const res = await request(server)
      .get(`/api/opportunities/${t.context.opportunities[0]._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.VOLUNTEER_PROVIDER])}`])

    t.is(200, res.status)
  })
  test.serial(`${role} - READ - can read COMPLETED status`, async t => {
    const res = await request(server)
      .get(`/api/opportunities/${t.context.opportunities[5]._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.VOLUNTEER_PROVIDER])}`])

    t.is(200, res.status)
  })
  test.serial(`${role} - READ - can not read DRAFT status`, async t => {
    const res = await request(server)
      .get(`/api/opportunities/${t.context.opportunities[2]._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.VOLUNTEER_PROVIDER])}`])

    t.is(404, res.status)
  })

  test.serial(`${role} - UPDATE - Can not update an opportunity they do not own`, async t => {
    let opId

    try {
      const op = await Opportunity.create({
        name: 'Cool op',
        status: OpportunityStatus.ACTIVE,
        requestor: await Person.findOne({ email: 'andrew@groat.nz' })
      })
      opId = op._id

      const res = await request(server)
        .put(`/api/opportunities/${opId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])
        .send({
          name: 'A new name' // Try and change the name of the op we do not own
        })

      t.is(404, res.status)

      // Make sure the op hasn't updated
      const op2 = await Opportunity.findById(opId)
      t.is(op2.name, 'Cool op')
    }
    finally {
      await Opportunity.deleteOne({ _id: opId })
    }
  })

  test.serial(`${role} - DELETE - Can not delete an opportunity they do not own`, async t => {
    let opId

    try {
      const op = await Opportunity.create({
        name: 'Cool op',
        status: OpportunityStatus.ACTIVE,
        requestor: await Person.findOne({ email: 'andrew@groat.nz' })
      })
      opId = op._id

      const res = await request(server)
        .delete(`/api/opportunities/${opId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])

      t.is(404, res.status)

      // Make sure the op hasn't been deleted
      const op2 = await Opportunity.findById(opId)
      t.truthy(op2)
    }
    finally {
      await Opportunity.deleteOne({ _id: opId })
    }
  })

  test.serial(`${role} - DELETE - Can delete an opportunity I own despite role which does not allow`, async t => {
    let opId

    try {
      const op = await Opportunity.create({
        name: 'Cool op',
        status: OpportunityStatus.ACTIVE,
        requestor: await Person.findOne({ email: 'andrew@groat.nz' })
      })
      opId = op._id

      const res = await request(server)
        .delete(`/api/opportunities/${opId}`)
        .set('Accept', 'application/json')
        .set('Cookie', [`idToken=${createJwtIdToken('andrew@groat.nz')}`])

      t.is(204, res.status)

      // Make sure the op has been deleted
      const op2 = await Opportunity.findById(opId)
      t.falsy(op2)
    }
    finally {
      await Opportunity.deleteOne({ _id: opId })
    }
  })
}
