import moment from 'moment'
import { InterestStatus } from '../../../server/api/interest/interest.constants'
import mongoose from 'mongoose'
import { OrganisationRole } from '../../../server/api/organisation/organisation.constants'
import { coin, gra, makeTeacher, makeVolunteer } from '../../Person/__tests__/makePeople.fixture'

const ObjectId = () => mongoose.Types.ObjectId().toHexString()
const offerOrg = {
  _id: ObjectId(),
  name: 'Normal School',
  slug: 'normal-school',
  role: [OrganisationRole.OPPORTUNITY_PROVIDER],
  imgUrl: 'https://example.com/images/school.png',
  info: {
    about: 'Awesome school'
  }
}
export const requestor = makeTeacher('alice')
export const opportunity = {
  _id: ObjectId(),
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  location: 'Newmarket, Auckland',
  requestor,
  offerOrg,
  tags: ['one', 'two', 'three'],
  status: 'active'
}

const { INVITED, INTERESTED, COMMITTED, DECLINED } = InterestStatus
const InterestStatusFeed = [INTERESTED, INTERESTED, INVITED, INVITED, COMMITTED, DECLINED]

const makeMessages = (numMessages, a, b, status, op) =>
  Array(numMessages).fill({}).map((item, index) => ({
    body: coin(`Example message ${a.name} is ${status} in ${op.name}`, 'Thanks for the feedback, I will be in touch'),
    author: coin(a, b),
    createdAt: moment().subtract(gra(5, 1200), 'minutes').format()
  }))

export const makeInterestedVolunteer = (name, status) => {
  const person = makeVolunteer(name)
  return {
    _id: ObjectId(),
    person,
    opportunity,
    messages: makeMessages(gra(2, 8), person, requestor, status, opportunity),
    status
  }
}
export const makeInterests = (name, numInterests, states = InterestStatusFeed) => {
  return (Array(numInterests).fill({}).map((item, index) => {
    const status = states[index % states.length]
    return (makeInterestedVolunteer(name, status))
  }))
}
