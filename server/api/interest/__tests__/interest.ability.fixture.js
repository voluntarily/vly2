import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Role } from '../../../services/authorize/role'
import Member from '../../member/member'
import { MemberStatus } from '../../member/member.constants'
import { OpportunityStatus } from '../../opportunity/opportunity.constants'
import Organisation from '../../organisation/organisation'
import Person from '../../person/person'
import { InterestStatus } from '../interest.constants'
import { OrganisationRole } from '../../organisation/organisation.constants'

const generateObjectId = mongoose.Types.ObjectId

const people = [
  { // 0
    _id: generateObjectId(),
    name: 'Admin',
    email: 'admin@example.com',
    role: [Role.ADMIN]
  },
  { // 1
    _id: generateObjectId(),
    name: 'Opportunity Provider 1',
    email: 'opportunity.provider.1@example.com',
    role: [Role.OPPORTUNITY_PROVIDER]
  },
  { // 2
    _id: generateObjectId(),
    name: 'Volunteer 1',
    email: 'volunteer.1@example.com',
    role: [Role.VOLUNTEER]
  },
  { // 3
    _id: generateObjectId(),
    name: 'Volunteer 2',
    email: 'volunteer.2@example.com',
    role: [Role.VOLUNTEER]
  },
  { // 4
    _id: generateObjectId(),
    name: 'Org Admin',
    email: 'org.admin@example.com',
    role: [Role.ORG_ADMIN]
  },
  { // 5
    _id: generateObjectId(),
    name: 'Opportunity Provider 2',
    email: 'opportunity.provider.2@example.com',
    role: [Role.OPPORTUNITY_PROVIDER]
  },
  { // 6
    _id: generateObjectId(),
    name: 'Volunteer + Opportunity Provider 1',
    email: 'volunteer.opportunity.provider.1@example.com',
    role: [Role.VOLUNTEER, Role.OPPORTUNITY_PROVIDER]
  },
  { // 7
    _id: generateObjectId(),
    name: 'Volunteer + Activity Provider',
    email: 'volunteer.3@example.com',
    role: [Role.VOLUNTEER, Role.ACTIVITY_PROVIDER]
  },
  { // 8
    _id: generateObjectId(),
    name: 'Volunteer + Opportunity Provider + Activity Provider',
    email: 'vp_op_ap@example.com',
    role: [Role.VOLUNTEER, Role.OPPORTUNITY_PROVIDER, Role.ACTIVITY_PROVIDER]
  }
]
export const PERSON = {
  ADMIN: 0,
  OP1: 1,
  VP1: 2,
  VP2: 3,
  ORGADMIN: 4,
  OP2: 5,
  VPOP: 6,
  VPAP: 7,
  VPOPAP: 8
}
const organisations = [
  {
    _id: generateObjectId(),
    name: 'Opportunity Provider 1',
    slug: 'opportunity-provider-1',
    role: [OrganisationRole.VOLUNTEER_PROVIDER]
  },
  {
    _id: generateObjectId(),
    name: 'Opportunity Provider 2',
    slug: 'opportunity-provider-2',
    role: ['op']
  }
]

const members = [
  { // 0
    _id: generateObjectId(),
    person: people[PERSON.VP1]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.MEMBER
  },
  { // 1
    _id: generateObjectId(),
    person: people[PERSON.ORGADMIN]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.ORGADMIN
  },
  { // 2
    _id: generateObjectId(),
    person: people[PERSON.OP2]._id,
    organisation: organisations[1]._id,
    status: MemberStatus.MEMBER
  },
  { // 3
    _id: generateObjectId(),
    person: people[PERSON.VPOP]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.MEMBER
  },
  { // 4
    _id: generateObjectId(),
    person: people[PERSON.VPAP]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.MEMBER
  },
  { // 5
    _id: generateObjectId(),
    person: people[PERSON.VPOPAP]._id,
    organisation: organisations[0]._id,
    status: MemberStatus.MEMBER
  }
]

const opportunities = [
  { // 0
    _id: generateObjectId(),
    status: OpportunityStatus.ACTIVE,
    requestor: people[PERSON.OP1]._id,
    offerOrg: organisations[0]._id
  },
  { // 1
    _id: generateObjectId(),
    status: OpportunityStatus.ACTIVE,
    requestor: people[PERSON.OP2]._id,
    offerOrg: organisations[1]._id
  },
  { // 2
    _id: generateObjectId(),
    status: OpportunityStatus.ACTIVE,
    requestor: people[PERSON.OP1]._id,
    offerOrg: organisations[0]._id
  },
  { // 3
    _id: generateObjectId(),
    status: OpportunityStatus.ACTIVE,
    requestor: people[PERSON.OP1]._id,
    offerOrg: organisations[0]._id
  },
  { // 4
    _id: generateObjectId(),
    status: OpportunityStatus.ACTIVE,
    requestor: people[PERSON.VPOPAP]._id,
    offerOrg: organisations[0]._id
  }
]

const interests = [
  { // 0
    person: people[PERSON.VP1]._id,
    opportunity: opportunities[0]._id,
    message: [{ body: 'Test comment', author: people[2]._id }],
    status: InterestStatus.INTERESTED
  },
  { // 1
    person: people[PERSON.VP2]._id,
    opportunity: opportunities[0]._id,
    message: [{ body: 'Test comment', author: people[3]._id }],
    status: InterestStatus.INTERESTED
  },
  { // 2
    person: people[PERSON.VP2]._id,
    opportunity: opportunities[1]._id,
    message: [{ body: 'Test comment 2', author: people[3]._id }],
    status: InterestStatus.INTERESTED
  },
  { // 3
    person: people[PERSON.OP2]._id,
    opportunity: opportunities[0]._id,
    message: [{ body: 'Test comment 1', author: people[6]._id }],
    status: InterestStatus.INTERESTED
  },
  { // 4
    person: people[PERSON.VPOP]._id,
    opportunity: opportunities[1]._id,
    message: [{ body: 'Test comment 2', author: people[6]._id }],
    status: InterestStatus.INTERESTED
  },
  { // 5
    person: people[PERSON.VP1]._id,
    opportunity: opportunities[2]._id,
    message: [{ body: 'Test comment', author: people[2]._id }],
    status: InterestStatus.INVITED
  },
  { // 6
    person: people[PERSON.VP1]._id,
    opportunity: opportunities[3]._id,
    message: [{ body: 'Test comment', author: people[2]._id }],
    status: InterestStatus.COMMITTED
  },
  { // 7
    person: people[PERSON.VP1]._id,
    opportunity: opportunities[3]._id,
    message: [{ body: 'Test comment', author: people[2]._id }],
    status: InterestStatus.COMMITTED
  },
  { // 8
    person: people[PERSON.VP1]._id,
    opportunity: opportunities[4]._id,
    message: [{ body: 'Test comment', author: people[2]._id }],
    status: InterestStatus.COMMITTED
  },
  { // 9
    person: people[PERSON.VPOPAP]._id,
    opportunity: opportunities[4]._id,
    message: [{ body: 'Test comment', author: people[2]._id }],
    status: InterestStatus.COMMITTED
  }
]

export const sessions = []

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

export const loadInterestFixtures = async (InterestModel, OpportunityModel) => {
  const loadedFixtures = {};

  [loadedFixtures.people, loadedFixtures.organisations] = await Promise.all([
    Person.create(people),
    Organisation.create(organisations)
  ]);

  [loadedFixtures.members, loadedFixtures.opportunities] = await Promise.all([
    Member.create(members),
    OpportunityModel.create(opportunities)
  ])

  loadedFixtures.interests = await InterestModel.create(interests)

  return loadedFixtures
}

export const clearInterestFixtures = async (InterestModel, OpportunityModel) => {
  await Promise.all([
    Person.deleteMany(),
    Organisation.deleteMany(),
    Member.deleteMany(),
    OpportunityModel.deleteMany(),
    InterestModel.deleteMany()
  ])
}
