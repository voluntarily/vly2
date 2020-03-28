import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import Member from '../../member/member'
import { Role } from '../../../services/authorize/role'
import { MemberStatus } from '../../member/member.constants'
import mongoose from 'mongoose'
import { generateTestSession } from '../../../util/test-generate-session'

const generateObjectId = mongoose.Types.ObjectId

const people = [
  {
    _id: generateObjectId(),
    name: 'Admin',
    email: 'admin@example.com',
    role: [Role.ADMIN]
  },
  {
    _id: generateObjectId(),
    name: 'Volunteer 1',
    email: 'volunteer.1@example.com',
    role: [Role.VOLUNTEER]
  },
  {
    _id: generateObjectId(),
    name: 'Volunteer 2',
    email: 'volunteer.2@example.com',
    role: [Role.VOLUNTEER]
  },
  {
    _id: generateObjectId(),
    name: 'Org Admin 1',
    email: 'org.admin.1@example.com',
    role: [Role.ORG_ADMIN]
  },
  {
    _id: generateObjectId(),
    name: 'Org Admin 2',
    email: 'org.admin.2@example.com',
    role: [Role.ORG_ADMIN]
  }
]

const organisations = [
  {
    _id: generateObjectId(),
    name: 'Organisation 1',
    slug: 'organisation-1'
  },
  {
    _id: generateObjectId(),
    name: 'Organisation 2',
    slug: 'organisation-2'
  }
]

const members = [
  {
    _id: generateObjectId(),
    person: people[1]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.MEMBER
  },
  {
    _id: generateObjectId(),
    person: people[1]._id,
    organisation: organisations[1]._id,
    status: MemberStatus.JOINER
  },
  {
    _id: generateObjectId(),
    person: people[3]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.ORGADMIN
  },
  {
    _id: generateObjectId(),
    person: people[4]._id,
    organisation: organisations[1]._id,
    status: MemberStatus.ORGADMIN
  }
]

const sessions = []

for (const person of people) {
  sessions.push(generateTestSession(person.name, person.email))
}

const loadInterestFixtures = async () => {
  const loadedFixtures = {};

  [loadedFixtures.people, loadedFixtures.organisations] = await Promise.all([
    Person.create(people),
    Organisation.create(organisations)
  ])

  loadedFixtures.members = await Member.create(members)

  return loadedFixtures
}

const clearInterestFixtures = async () => {
  await Promise.all([
    Person.deleteMany(),
    Organisation.deleteMany(),
    Member.deleteMany()
  ])
}

module.exports = {
  sessions,
  loadInterestFixtures,
  clearInterestFixtures
}
