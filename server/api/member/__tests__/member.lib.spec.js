import test from 'ava'
import MemoryMongo from '../../../util/test-memory-mongo'
import fixtures from './member.lib.fixtures'
import Member from '../member'
import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import { MemberStatus } from '../member.constants'
import { findOrgByPersonIdAndCategory } from '../member.lib'

test.before('Database start', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.beforeEach('Load fixtures', async (t) => {
  const [organisations, people] = await Promise.all([
    Organisation.create(fixtures.organisations),
    Person.create(fixtures.people)
  ])

  const members = [
    {
      person: people[0]._id,
      organisation: organisations[0]._id,
      validation: 'orgAdmin',
      status: MemberStatus.ORGADMIN
    },
    {
      person: people[0]._id,
      organisation: organisations[1]._id,
      validation: 'member',
      status: MemberStatus.MEMBER
    },
    {
      person: people[1]._id,
      organisation: organisations[0]._id,
      validation: 'joiner',
      status: MemberStatus.JOINER
    },
    {
      person: people[1]._id,
      organisation: organisations[1]._id,
      validation: 'follower',
      status: MemberStatus.FOLLOWER
    },
    {
      person: people[1]._id,
      organisation: organisations[2]._id,
      validation: 'member',
      status: MemberStatus.MEMBER
    },
    {
      person: people[1]._id,
      organisation: organisations[3]._id,
      validation: 'orgAdmin',
      status: MemberStatus.ORGADMIN
    }
  ]

  t.context.members = await Member.create(members)
  t.context.organisations = organisations
  t.context.people = people
})

test.afterEach.always('Clear fixtures', async (t) => {
  await Promise.all([
    Organisation.deleteMany({}),
    Person.deleteMany({}),
    Member.deleteMany({})
  ])
})

test.after.always('Database stop', async (t) => {
  await t.context.memMongo.stop()
})

test.serial('Find org by person and category', async (t) => {
  const testData = [
    {
      personId: t.context.people[0]._id,
      category: null,
      expectedOrgId: t.context.organisations[0]._id.str
    },
    {
      personId: t.context.people[0]._id,
      category: 'ap',
      expectedOrgId: t.context.organisations[1]._id.str
    },
    {
      personId: t.context.people[1]._id,
      category: null,
      expectedOrgId: t.context.organisations[3]._id.str
    },
    {
      personId: t.context.people[2]._id,
      category: null,
      expectedOrgId: null
    }
  ]

  t.plan(testData.length)

  for (const testRecord of testData) {
    let orgId = await findOrgByPersonIdAndCategory(testRecord.personId, testRecord.category)

    if (orgId !== null) {
      orgId = orgId.str
    }

    t.is(
      testRecord.expectedOrgId,
      orgId
    )
  }
})
