import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import Member from '../../member/member'
import ArchivedOpportunity from '../../archivedOpportunity/archivedOpportunity'
import InterestArchive from '../interestArchive'
import { InterestStatus } from '../../interest/interest.constants'
import { Role } from '../../../services/authorize/role'
import { MemberStatus } from '../../member/member.constants'
import { OpportunityStatus } from '../../opportunity/opportunity.constants'
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
    name: 'Opportunity Provider 1',
    email: 'opportunity.provider.1@example.com',
    role: [Role.OPPORTUNITY_PROVIDER]
  },
  {
    _id: generateObjectId(),
    name: 'Volunteer 1',
    email: 'volunteer.1@example.com',
    role: [Role.VOLUNTEER_PROVIDER]
  },
  {
    _id: generateObjectId(),
    name: 'Volunteer 2',
    email: 'volunteer.2@example.com',
    role: [Role.VOLUNTEER_PROVIDER]
  },
  {
    _id: generateObjectId(),
    name: 'Org Admin',
    email: 'org.admin@example.com',
    role: [Role.ORG_ADMIN]
  },
  {
    _id: generateObjectId(),
    name: 'Opportunity Provider 2',
    email: 'opportunity.provider.2@example.com',
    role: [Role.OPPORTUNITY_PROVIDER]
  }
]

const organisations = [
  {
    _id: generateObjectId(),
    name: 'Opportunity Provider 1',
    slug: 'opportunity-provider-1',
    category: ['op']
  },
  {
    _id: generateObjectId(),
    name: 'Opportunity Provider 2',
    slug: 'opportunity-provider-2',
    category: ['op']
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
    person: people[4]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.ORGADMIN
  },
  {
    _id: generateObjectId(),
    person: people[5]._id,
    organisation: organisations[1]._id,
    status: MemberStatus.MEMBER
  }
]

const archivedOpportunities = [
  {
    _id: generateObjectId(),
    status: OpportunityStatus.ACTIVE,
    requestor: people[1]._id,
    offerOrg: organisations[0]._id
  },
  {
    _id: generateObjectId(),
    status: OpportunityStatus.ACTIVE,
    requestor: people[5]._id,
    offerOrg: organisations[1]._id
  }
]

const archivedInterests = [
  {
    person: people[2]._id,
    opportunity: archivedOpportunities[0]._id,
    comment: 'Test comment',
    status: InterestStatus.INTERESTED
  },
  {
    person: people[3]._id,
    opportunity: archivedOpportunities[0]._id,
    comment: 'Test comment',
    status: InterestStatus.INTERESTED
  },
  {
    person: people[3]._id,
    opportunity: archivedOpportunities[1]._id,
    comment: 'Test comment 2',
    status: InterestStatus.INTERESTED
  }
]

const sessions = []

for (const person of people) {
  const session = generateTestSession(person.name, person.email)

  sessions.push(session)
}

const loadInterestFixtures = async () => {
  const loadedFixtures = {};

  [loadedFixtures.people, loadedFixtures.organisations] = await Promise.all([
    Person.create(people),
    Organisation.create(organisations)
  ]);

  [loadedFixtures.members, loadedFixtures.archivedOpportunities] = await Promise.all([
    Member.create(members),
    ArchivedOpportunity.create(archivedOpportunities)
  ])

  loadedFixtures.archivedInterests = await InterestArchive.create(archivedInterests)

  return loadedFixtures
}

const clearInterestFixtures = async () => {
  await Promise.all([
    Person.deleteMany(),
    Organisation.deleteMany(),
    Member.deleteMany(),
    ArchivedOpportunity.deleteMany(),
    InterestArchive.deleteMany()
  ])
}

module.exports = {
  sessions,
  loadInterestFixtures,
  clearInterestFixtures
}
