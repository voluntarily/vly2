import test from 'ava'
import Member from '../member'
import { MemberStatus } from '../member.constants'
import Organisation from '../../organisation/organisation'
import Person from '../../person/person'
import MemoryMongo from '../../../util/test-memory-mongo'
import people from '../../person/__tests__/person.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import { addMember, findOrgByPersonIdAndRole } from '../member.lib'

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
  } catch (e) {
    console.error('member.spec.js - error in test setup', e)
  }

  t.context.people = await Person.create(people).catch((err) => `Unable to create people: ${err}`)
  t.context.orgs = await Organisation.create(orgs).catch((err) => `Unable to create organisations: ${err}`)
  t.context.org = t.context.orgs[0]
  t.context.andrew = t.context.people[0]
  t.context.dali = t.context.people[1]
  t.context.alice = t.context.people[2]
})

test.after.always(async (t) => {
  // await Person.deleteMany()
  await t.context.memMongo.stop()
})

test.serial('Should add a member when they are not there already', async t => {
  const membershipQuery = {
    person: t.context.alice._id,
    organisation: t.context.org._id
  }
  // show alice is not currently a member
  let membership = await Member.findOne(membershipQuery).exec()
  t.falsy(membership)

  const member = {
    person: t.context.alice._id,
    organisation: t.context.orgs[0]._id,
    validation: 'test follower',
    status: MemberStatus.FOLLOWER
  }

  let newMember = await addMember(member)
  t.truthy(newMember)
  t.is(newMember.person.nickname, t.context.alice.nickname)
  // and the members record will exist
  membership = await Member.findOne(membershipQuery).exec()
  t.truthy(membership)
  t.is(membership.status, MemberStatus.FOLLOWER)

  // now update to be a MEMBER
  member.status = MemberStatus.MEMBER
  newMember = await addMember(member)
  t.truthy(newMember)
  t.is(newMember.person.nickname, t.context.alice.nickname)
  // and the members record will exist
  membership = await Member.findOne(membershipQuery).exec()
  t.truthy(membership)
  t.is(membership.status, MemberStatus.MEMBER)
})

test.serial('findOrgByPersonIdAndRole', async t => {
  const member = {
    person: t.context.andrew._id,
    organisation: t.context.orgs[1]._id, // omgtech is an op
    validation: 'test follower',
    status: MemberStatus.MEMBER
  }

  await addMember(member)

  let orgid = await findOrgByPersonIdAndRole(t.context.alice._id, 'op')
  t.is(orgid, null)
  orgid = await findOrgByPersonIdAndRole(t.context.andrew._id, 'op')
  t.deepEqual(orgid, t.context.orgs[1]._id)
  // try with no role
  orgid = await findOrgByPersonIdAndRole(t.context.andrew._id, null)
  t.deepEqual(orgid, t.context.orgs[1]._id)
})
