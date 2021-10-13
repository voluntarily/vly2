import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import MemoryMongo from '../../../util/test-memory-mongo'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import { jwtData, jwtDataAlice, jwtDataDali } from '../../../middleware/session/__tests__/setSession.fixture'
import ArchivedOpportunity from '../archivedOpportunity'
import { OpportunityStatus, OpportunityFields, OpportunityListFields } from '../../opportunity/opportunity.constants'
import { OrganisationRole } from '../../organisation/organisation.constants'
import archivedOps from './archivedOpportunity.fixture'

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('connect and add two activity entries', async (t) => {
  t.context.people = await Person.create(people)

  const linkedArchivedOps = archivedOps.map((op, index) => {
    return {
      ...op,
      requestor: t.context.people[2]._id // alice is op for all ops
    }
  })

  t.context.archivedOpportunities = await ArchivedOpportunity.create(linkedArchivedOps)
})

test.afterEach.always(async () => {
  await Promise.all([
    ArchivedOpportunity.deleteMany(),
    Person.deleteMany()
  ])
})

const getCompletedOps = (archivedOps) => {
  return archivedOps.filter(
    archivedOp => [OpportunityStatus.COMPLETED].includes(archivedOp.status)
  )
}

const testDataByRole = [
  {
    roleName: 'anon',
    cookie: null,
    getExpectedArchivedOps: getCompletedOps,
    listExpectedFields: OpportunityListFields,
    readExpectedFields: Object.values(OpportunityFields),
    expectedPostStatus: 403,
    expectedPutStatus: 403,
    expectedDeleteStatus: 403
  },
  {
    roleName: 'admin',
    cookie: `idToken=${jwtData.idToken}`,
    getExpectedArchivedOps: (archivedOps) => archivedOps,
    listExpectedFields: OpportunityListFields, // admins see all fields
    readExpectedFields: Object.values(OpportunityFields),
    expectedPostStatus: 200,
    expectedPutStatus: 200,
    expectedDeleteStatus: 200
  },
  {
    roleName: OrganisationRole.ACTIVITY_PROVIDER,
    cookie: `idToken=${jwtDataDali.idToken}`,
    getExpectedArchivedOps: getCompletedOps,
    listExpectedFields: OpportunityListFields,
    readExpectedFields: Object.values(OpportunityFields),
    expectedPostStatus: 403,
    expectedPutStatus: 403,
    expectedDeleteStatus: 403
  },
  {
    roleName: 'op',
    cookie: `idToken=${jwtDataAlice.idToken}`,
    getExpectedArchivedOps: (archivedOps) => archivedOps,
    listExpectedFields: OpportunityListFields,
    readExpectedFields: Object.values(OpportunityFields),
    expectedPostStatus: 403,
    expectedPutStatus: 403,
    expectedDeleteStatus: 403
  }
]

for (const testData of testDataByRole) {
  test.serial(`Archived Opportunity API - list - ${testData.roleName}`, async t => {
    const response = await request(server)
      .get('/api/archivedOpportunities')
      .set('Cookie', [testData.cookie])
      .set('Accept', 'application/json')

    const actualArchivedOps = response.body
    const expectedArchivedOps = testData.getExpectedArchivedOps(t.context.archivedOpportunities)

    t.is(response.statusCode, 200)
    t.is(actualArchivedOps.length, expectedArchivedOps.length, testData.roleName)

    const expectedFields = testData.listExpectedFields
    const actualFields = Object.keys(actualArchivedOps[0])
    t.is(actualFields.length, expectedFields.length)

    for (const expectedField of expectedFields) {
      t.true(actualFields.includes(expectedField))
    }
  })
}

for (const testData of testDataByRole) {
  test.serial(`Archived Opportunity API - read - ${testData.roleName}`, async t => {
    const expectedOp = t.context.archivedOpportunities
      .filter(archivedOp => archivedOp.status === OpportunityStatus.COMPLETED)
      .pop()

    const response = await request(server)
      .get(`/api/archivedOpportunities/${expectedOp._id}`)
      .set('Cookie', [testData.cookie])
      .set('Accept', 'application/json')

    const actualArchivedOp = response.body

    t.is(response.statusCode, 200)

    const expectedFields = testData.readExpectedFields
    const actualFields = Object.keys(actualArchivedOp)

    t.is(actualFields.length, expectedFields.length)

    for (const expectedField of expectedFields) {
      t.true(actualFields.includes(expectedField))
    }
  })
}

for (const testData of testDataByRole) {
  test.serial(`Archived Opportunity API - create - ${testData.roleName}`, async t => {
    const response = await request(server)
      .post('/api/archivedOpportunities')
      .set('Cookie', [testData.cookie])
      .set('Accept', 'application/json')
      .send({
        name: 'Test archived opportunity',
        subtitle: 'Subtitle',
        description: 'Description',
        duration: '2 days',
        location: 'Wellington',
        status: OpportunityStatus.ACTIVE,
        requestor: t.context.people[0]._id
      })

    t.is(response.statusCode, testData.expectedPostStatus)
  })
}

for (const testData of testDataByRole) {
  test.serial(`Archived Opportunity API - update - ${testData.roleName}`, async t => {
    const archivedOpToUpdate = t.context.archivedOpportunities[0]

    const response = await request(server)
      .put(`/api/archivedOpportunities/${archivedOpToUpdate._id}`)
      .set('Cookie', [testData.cookie])
      .set('Accept', 'application/json')
      .send({
        name: 'Updated name'
      })

    t.is(response.statusCode, testData.expectedPutStatus)
  })
}

for (const testData of testDataByRole) {
  test.serial(`Archived Opportunity API - delete - ${testData.roleName}`, async t => {
    const archivedOpToDelete = t.context.archivedOpportunities[0]

    const response = await request(server)
      .delete(`/api/archivedOpportunities/${archivedOpToDelete._id}`)
      .set('Cookie', [testData.cookie])
      .set('Accept', 'application/json')

    t.is(response.statusCode, testData.expectedDeleteStatus)
  })
}
