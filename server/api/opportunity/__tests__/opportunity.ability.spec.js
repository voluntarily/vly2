import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Tag from '../../tag/tag'
import Opportunity from '../opportunity'
import { OpportunityStatus, OpportunityPublicFields, OpportunityPublishedStatus } from '../opportunity.constants'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import Activity from '../../activity/activity'
import Organisation from '../../organisation/organisation'
import Organisations from '../../organisation/__tests__/organisation.fixture'
import ops from './opportunity.fixture.js'
import tags from '../../tag/__tests__/tag.fixture'
import { ObjectId } from 'mongodb'
import jsonwebtoken from 'jsonwebtoken'
import { jwtData } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import uuid from 'uuid'
import { Role } from '../../../services/authorize/role'
import Member from '../../member/member'
const { MemberStatus } = require('../../member/member.constants')

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

const assertContainsOnlyPublicFields = (test, obj) => {
  for (const key of Object.keys(obj)) {
    test.true(OpportunityPublicFields.includes(key), `The response contained an invalid field: '${key}'`)
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
  await Organisation.create(Organisations)
})

test.serial('Anonymous - READ by id', async t => {
  const res = await request(server)
    .get(`/api/opportunities/${t.context.opportunities[0]._id}`)
    .set('Accept', 'application/json')

  t.is(200, res.status)
  assertContainsOnlyPublicFields(t, res.body)
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
    assertContainsOnlyPublicFields(t, op)
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

for (const role of [Role.VOLUNTEER, Role.OPPORTUNITY_PROVIDER, Role.ORG_ADMIN]) {
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
    t.is(3, res.body.length) // Anon sees only ACTIVE ops
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
      .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.VOLUNTEER])}`])

    t.is(200, res.status)
    t.is(3, res.body.length) // There are 3 ACTIVE ops in the fixture file
    t.truthy(res.body.find(op => op.name === '1 Mentor a year 12 business Impact Project'))
    t.truthy(res.body.find(op => op.name === '2 Self driving model cars'))
    // DRAFT ops will have been trimmed from the response
  })

  test.serial(`${role} - READ - can read ACTIVE status`, async t => {
    const res = await request(server)
      .get(`/api/opportunities/${t.context.opportunities[0]._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.VOLUNTEER])}`])

    t.is(200, res.status)
  })

  test.serial(`${role} - DELETE - Can not delete an opportunity`, async t => {
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

      t.true(res.status === 404 || res.status === 403)

      // Make sure the op hasn't been deleted
      const op2 = await Opportunity.findById(opId)
      t.truthy(op2)
    } finally {
      await Opportunity.deleteOne({ _id: opId })
    }
  })
}

for (const role of [Role.VOLUNTEER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER]) {
  test.serial(`${role} - READ - can not read DRAFT status`, async t => {
    const res = await request(server)
      .get(`/api/opportunities/${t.context.opportunities[2]._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])

    t.true([403, 404].includes(res.status))
  })

  test.serial(`${role} - READ - can read op I own even if in DRAFT status`, async t => {
    const person = await createPerson([role])

    const op = await Opportunity.create({
      name: `${uuid()}`,
      status: OpportunityStatus.DRAFT,
      requestor: await Person.findOne({ email: person.email })
    })

    const res = await request(server)
      .get(`/api/opportunities/${op._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${createJwtIdToken(person.email)}`])

    if (role === Role.OPPORTUNITY_PROVIDER) {
      t.is(200, res.status)
      t.is(res.body._id, op._id.toString())
    } else {
      t.true([403, 404].includes(res.status))
    }
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

      t.true([403, 404].includes(res.status))

      // Make sure the op hasn't updated
      const op2 = await Opportunity.findById(opId)
      t.is(op2.name, 'Cool op')
    } finally {
      await Opportunity.deleteOne({ _id: opId })
    }
  })
}

test.serial('orgAdmin - UPDATE - Can update ops for their org', async t => {
  const omgTech = await Organisation.findOne({ name: 'OMGTech' })

  // "atesty@voluntarily.nz" is now an org admin of "OMGTech"
  await Member.create({
    person: await Person.findOne({ email: 'atesty@voluntarily.nz' }),
    organisation: omgTech,
    status: MemberStatus.ORGADMIN
  })

  // Create an op as "btesty"
  const op = await Opportunity.create({
    name: 'Cool op',
    status: OpportunityStatus.ACTIVE,
    requestor: await Person.findOne({ email: 'btesty@voluntarily.nz' }),
    offerOrg: omgTech
  })

  // Have "atesty" (the org admin) update the op
  const res = await request(server)
    .put(`/api/opportunities/${op._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${createJwtIdToken('atesty@voluntarily.nz')}`])
    .send({
      name: 'A new name' // Try and change the name of the op we do not own
    })

  t.is(200, res.status)

  const op2 = await Opportunity.findById(op._id)
  t.is(op2.name, 'A new name')
})

test.serial('orgAdmin - CREATE', async t => {
  const orgA = await Organisation.findOne({ name: 'OMGTech' })
  const requestor = (await Person.find())[0]

  // personA is an org admin for orgA
  const personA = await createPerson([Role.VOLUNTEER])
  await Member.create({
    person: personA,
    organisation: orgA,
    status: MemberStatus.ORGADMIN
  })

  // Create an op on my org
  const res = await request(server)
    .post('/api/opportunities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${createJwtIdToken(personA.email)}`])
    .send({
      status: OpportunityStatus.ACTIVE,
      offerOrg: orgA._id,
      requestor: requestor._id
    })

  t.is(200, res.status)
})

test.serial('orgAdmin - CREATE - attempt to create an op for an org I am not apart of', async t => {
  const orgA = await Organisation.findOne({ name: 'OMGTech' })
  const orgB = await Organisation.findOne({ name: 'Datacom' })

  // personA is an org admin for orgA
  const personA = await createPerson([Role.VOLUNTEER])
  await Member.create({
    person: personA,
    organisation: orgA,
    status: MemberStatus.ORGADMIN
  })

  // personB is an org admin for orgB
  const personB = await createPerson([Role.VOLUNTEER])
  await Member.create({
    person: personB,
    organisation: orgB,
    status: MemberStatus.MEMBER
  })

  // Try to create an op in orgB as user personA
  const res = await request(server)
    .post('/api/opportunities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${createJwtIdToken(personA.email)}`])
    .send({
      status: OpportunityStatus.ACTIVE,
      offerOrg: orgB._id.toString(),
      requestor: personA._id.toString()
    })

  t.is(403, res.status)
})

test.serial('Owner - READ', async t => {
  let opId

  try {
    const op = await Opportunity.create({
      name: 'Cool op',
      status: OpportunityStatus.ACTIVE,
      requestor: await Person.findOne({ email: 'andrew@groat.nz' })
    })
    opId = op._id

    const res = await request(server)
      .get(`/api/opportunities/${opId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${createJwtIdToken('andrew@groat.nz')}`])

    t.is(200, res.status)
    t.is(res.body._id, op._id.toString())
  } finally {
    await Opportunity.deleteOne({ _id: opId })
  }
})

test.serial('Owner - DELETE - Cannot delete an opportunity', async t => {
  let opId

  try {
    const requestor = await createPerson([Role.VOLUNTEER])

    const op = await Opportunity.create({
      name: 'Cool op',
      status: OpportunityStatus.ACTIVE,
      requestor
    })

    const res = await request(server)
      .delete(`/api/opportunities/${op._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${createJwtIdToken(requestor.email)}`])

    t.is(403, res.status)

    // Make sure the op is still present
    const op2 = await Opportunity.findById(op._id)
    t.truthy(op2)
  } finally {
    await Opportunity.deleteOne({ _id: opId })
  }
})

test.serial('Owner - UPDATE - Can update an opportunity I created/own', async t => {
  let opId

  try {
    const requestor = await createPerson([Role.OPPORTUNITY_PROVIDER])

    const op = await Opportunity.create({
      name: 'Cool op',
      status: OpportunityStatus.ACTIVE,
      requestor
    })

    const res = await request(server)
      .put(`/api/opportunities/${op._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${createJwtIdToken(requestor.email)}`])
      .send({
        name: 'Awesome op'
      })

    t.is(200, res.status)

    const op2 = await Opportunity.findById(op._id)
    t.truthy(op2)
    t.is(op2.name, 'Awesome op')
  } finally {
    await Opportunity.deleteOne({ _id: opId })
  }
})

for (const role of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ORG_ADMIN, Role.RESOURCE_PROVIDER, Role.TESTER, Role.VOLUNTEER]) {
  test.serial(`${role} - UPDATE - Cannot set the offerOrg to an org I am not a member of`, async t => {
    const requestor = await createPerson([role])

    const orgA = await Organisation.create({
      name: `${uuid()}`,
      slug: `${uuid()}`
    })
    const orgB = await Organisation.create({
      name: `${uuid()}`,
      slug: `${uuid()}`
    })

    // Create op in organisation A
    const op = await Opportunity.create({
      name: 'Cool op',
      status: OpportunityStatus.ACTIVE,
      requestor,
      offerOrg: orgA
    })

    // Attempt to move it to organisation B
    const res = await request(server)
      .put(`/api/opportunities/${op._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${createJwtIdToken(requestor.email)}`])
      .send({
        name: 'Awesome op',
        offerOrg: orgB._id
      })

    t.true(res.status === 400 || res.status === 403)

    const op2 = await Opportunity.findById(op._id)
    t.truthy(op2)
    t.is(op2.name, 'Cool op')
    t.is(op2.offerOrg._id.toString(), orgA._id.toString())
  })
}

test.serial('owner - UPDATE - updating an op with deeply equal payload returns success', async t => {
  const op = await Opportunity.create({
    name: uuid(),
    title: uuid(),
    subtitle: uuid(),
    imgUrl: 'https://img.com/1.png',
    description: 'Test op',
    duration: '5 days',
    location: 'Auckland',
    venue: 'Business center',
    status: OpportunityStatus.ACTIVE,
    date: ['2019-05-23T12:26:18.000Z'],
    requestor: await Person.findOne({ email: 'btesty@voluntarily.nz' }),
    href: 'https://vly.nz/123',
    tags: ['a', 'b']
  })

  // GET the op and immediately PUT it back
  const get = await request(server)
    .get(`/api/opportunities/${op._id}`)

  t.is(get.status, 200)

  const res = await request(server)
    .put(`/api/opportunities/${op._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${createJwtIdToken('btesty@voluntarily.nz')}`])
    .send(get.body)

  t.is(res.status, 200)
})

test.serial('admin - LIST - Should get all opportunities', async t => {
  // Query for all opportunities
  // We use an empty query in the querystring so no default filtering is applied
  const res = await request(server)
    .get('/api/opportunities?q={}')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.ADMIN])}`])

  t.is(200, res.status)
  t.is(res.body.length, await Opportunity.countDocuments())
})

test.serial('admin - READ - Can read any opportunity', async t => {
  // The opportunity fixture file contains a variety of ops in various states, make sure we can read all of these
  const opsPromises = (await Opportunity.find()).map(async (op) => {
    return request(server)
      .get(`/api/opportunities/${op._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.ADMIN])}`])
  })

  const ops = await Promise.all(opsPromises)

  for (const op of ops) {
    t.is(200, op.status)
  }
})

test.serial('admin - CREATE', async t => {
  const org = (await Organisation.find())[0]
  const requestor = (await Person.find())[0]
  const activity = await Activity.create({
    name: `${uuid()}`,
    subtitle: 'Professionals talk about their work',
    imgUrl: 'https://www.tvnz.co.nz',
    description: 'abc',
    duration: '12 weeks',
    status: 'active',
    offerOrg: org._id
  })

  const payload = {
    name: uuid(),
    title: uuid(),
    subtitle: uuid(),
    imgUrl: 'https://img.com/1.png',
    description: 'Test op',
    duration: '5 days',
    location: 'Auckland',
    venue: 'Business center',
    status: OpportunityStatus.ACTIVE,
    date: ['2019-05-23T12:26:18.000Z'],
    fromActivity: activity._id,
    offerOrg: org._id,
    requestor: requestor._id,
    href: 'https://vly.nz/123',
    tags: ['a', 'b']
  }

  const res = await request(server)
    .post('/api/opportunities')
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.ADMIN])}`])
    .send(payload)

  t.is(200, res.status)

  // Get the op from the database and compare
  const op = await Opportunity.findById(res.body._id)
  t.truthy(op)
  for (const field of ['name', 'title', 'subtitle', 'imgUrl', 'description', 'duration', 'location', 'venue', 'status', 'href']) {
    t.is(res.body[field], payload[field])
  }
  t.truthy(res.body.tags)
  t.true(res.body.tags.includes('a'))
  t.true(res.body.tags.includes('b'))
  t.is(res.body.offerOrg, org._id.toString())
  t.is(res.body.requestor, requestor._id.toString())
})

test.serial('admin - UPDATE', async t => {
  const org = (await Organisation.find())[0]
  const requestor = (await Person.find())[0]
  const activity = await Activity.create({
    name: `op ${uuid()}`,
    subtitle: 'Professionals talk about their work',
    imgUrl: 'https://www.tvnz.co.nz',
    description: 'abc',
    duration: '12 weeks',
    status: 'active',
    offerOrg: org._id
  })

  const op = await Opportunity.create({
    name: uuid(),
    title: uuid(),
    subtitle: uuid(),
    imgUrl: 'https://img.com/1.png',
    description: 'Test op',
    duration: '5 days',
    location: 'Auckland',
    venue: 'Business center',
    status: OpportunityStatus.ACTIVE,
    date: ['2019-05-23T12:26:18.000Z'],
    fromActivity: activity._id,
    offerOrg: org._id,
    requestor: requestor._id,
    href: 'https://vly.nz/123',
    tags: ['a', 'b']
  })

  // Update fields
  const payload = {
    name: uuid(),
    title: uuid(),
    subtitle: uuid(),
    imgUrl: 'https://img.com/2.png',
    description: 'Test op 2',
    duration: '10 days',
    location: 'Wellington',
    venue: 'School',
    status: OpportunityStatus.DRAFT,
    date: ['2020-01-01T12:26:18.000Z'],
    offerOrg: org._id,
    requestor: requestor._id,
    href: 'https://vly.nz/456',
    tags: ['c', 'd']
  }

  const res = await request(server)
    .put(`/api/opportunities/${op._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.ADMIN])}`])
    .send(payload)

  t.is(200, res.status)

  // Get the op from the database and compare
  const op2 = await Opportunity.findById(op._id)
  t.truthy(op2)
  for (const field of ['name', 'title', 'subtitle', 'imgUrl', 'description', 'duration', 'location', 'venue', 'status', 'href']) {
    t.is(op2[field], payload[field])
  }
  t.truthy(op2.tags)
  t.true(op2.tags.includes('c'))
  t.true(op2.tags.includes('d'))
  t.is(op2.offerOrg._id.toString(), org._id.toString())
  t.is(op2.requestor._id.toString(), requestor._id.toString())
})

test.serial('admin - DELETE - Admin can delete ops', async t => {
  const requestor = (await Person.find())[0]

  const op = await Opportunity.create({
    status: OpportunityStatus.ACTIVE,
    requestor: requestor._id
  })

  const res = await request(server)
    .delete(`/api/opportunities/${op._id}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${await createPersonAndGetToken([Role.ADMIN])}`])

  t.is(204, res.status)
  const op2 = await Opportunity.findById(res.body._id)
  t.falsy(op2)
})

for (const role of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ORG_ADMIN, Role.RESOURCE_PROVIDER, Role.TESTER, Role.VOLUNTEER]) {
  test.serial(`${role} - UPDATE - Cannot set the fromActivity field`, async t => {
    const op = await Opportunity.create({
      requestor: await createPerson([Role.ACTIVITY_PROVIDER])
    })

    const res = await request(server)
      .put(`/api/opportunities/${op._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${await createPersonAndGetToken([role])}`])
      .send({
        fromActivity: new ObjectId('54759eb3c090d83494e2d804')
      })

    t.true(res.status === 400 || res.status === 403)
  })
}

for (const role of [Role.OPPORTUNITY_PROVIDER]) {
  test.serial(`${role} - can CREATE`, async t => {
    const org = await Organisation.create({
      name: `${uuid()}`,
      slug: `${uuid()}`
    })
    const requestor = await createPerson([role])
    await Member.create({
      person: requestor,
      organisation: org
    })

    const res = await request(server)
      .post('/api/opportunities')
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${createJwtIdToken(requestor.email)}`])
      .send({
        name: uuid(),
        offerOrg: org._id,
        requestor: requestor._id
      })

    t.is(200, res.status)
  })

  test.serial(`${role} - CREATE - must be part of the organisation`, async t => {
    // Create an org, but do not join the user
    const org = await Organisation.create({
      name: `${uuid()}`,
      slug: `${uuid()}`
    })
    const requestor = await createPerson([role])

    // Create an op for the newly created org, but because the user is not a member of this org it will not be allowed
    const res = await request(server)
      .post('/api/opportunities')
      .set('Accept', 'application/json')
      .set('Cookie', [`idToken=${createJwtIdToken(requestor.email)}`])
      .send({
        name: uuid(),
        offerOrg: org._id,
        requestor: requestor._id
      })

    t.is(403, res.status)
  })
}
