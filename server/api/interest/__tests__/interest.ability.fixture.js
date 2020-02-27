import Person from '../../person/person'
import Organisation from '../../organisation/organisation'
import Member from '../../member/member'
import Opportunity from '../../opportunity/opportunity'
import Interest from '../interest'
import { InterestStatus } from '../interest.constants'
import { Role } from '../../../services/authorize/role'
import { MemberStatus } from '../../member/member.constants'
import { OpportunityStatus } from '../../opportunity/opportunity.constants'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

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
  },
  {
    _id: generateObjectId(),
    name: 'Volunteer + Opportunity Provider 1',
    email: 'volunteer.opportunity.provider.1@example.com',
    role: [Role.VOLUNTEER_PROVIDER, Role.OPPORTUNITY_PROVIDER]
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
  },
  {
    _id: generateObjectId(),
    person: people[6]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.MEMBER
  }
]

const opportunities = [
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

const interests = [
  {
    person: people[2]._id,
    opportunity: opportunities[0]._id,
    comment: 'Test comment',
    status: InterestStatus.INTERESTED
  },
  {
    person: people[3]._id,
    opportunity: opportunities[0]._id,
    comment: 'Test comment',
    status: InterestStatus.INTERESTED
  },
  {
    person: people[3]._id,
    opportunity: opportunities[1]._id,
    comment: 'Test comment 2',
    status: InterestStatus.INTERESTED
  },
  {
    person: people[6]._id,
    opportunity: opportunities[0]._id,
    comment: 'Test comment 1',
    status: InterestStatus.INTERESTED
  },
  {
    person: people[6]._id,
    opportunity: opportunities[1]._id,
    comment: 'Test comment 2',
    status: InterestStatus.INTERESTED
  }
]

const sessions = []

for (const person of people) {
  const session = {
    accessToken: 'IGs4bjO5WLjsulmjKiW2-VLeetlgykUP',
    idTokenPayload: {
      email: person.email,
      email_verified: true,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      iat: Math.floor(Date.now() / 1000),
      name: person.name,
      nickname: '',
      picture: ''
    },
    refreshToken: null,
    state: 'Nz_CgRTnYPO5CbD4ueKmkdCiuk2z3psk',
    expiresIn: 3600,
    tokenType: 'Bearer',
    scope: null
  }

  session.idToken = jwt.sign(session.idTokenPayload, 'secret')

  sessions.push(session)
}

const loadInterestFixtures = async () => {
  const loadedFixtures = {};

  [loadedFixtures.people, loadedFixtures.organisations] = await Promise.all([
    Person.create(people),
    Organisation.create(organisations)
  ]);

  [loadedFixtures.members, loadedFixtures.opportunities] = await Promise.all([
    Member.create(members),
    Opportunity.create(opportunities)
  ])

  loadedFixtures.interests = await Interest.create(interests)

  return loadedFixtures
}

const clearInterestFixtures = async () => {
  await Promise.all([
    Person.deleteMany(),
    Organisation.deleteMany(),
    Member.deleteMany(),
    Opportunity.deleteMany(),
    Interest.deleteMany()
  ])
}

module.exports = {
  sessions,
  loadInterestFixtures,
  clearInterestFixtures
}
