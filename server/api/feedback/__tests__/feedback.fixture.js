import {
  OpportunityStatus,
  OpportunityType
} from '../../opportunity/opportunity.constants'
import { InterestStatus } from '../../interest/interest.constants'
import mongoose from 'mongoose'

export const people = [
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Andrew',
    email: 'andrew@groat.nz',
    role: ['admin']
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Dali',
    email: 'salvador@voluntarily.nz',
    role: ['volunteer']
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Charles',
    email: 'newperson@voluntarily.nz',
    role: ['orgAdmin']
  }
]

export const organisations = [
  {
    _id: mongoose.Types.ObjectId(),
    name: "charles' angels",
    slug: 'charles-angles',
    role: ['vp']
  },
  {
    _id: mongoose.Types.ObjectId(),
    name: 'doofenshmirtz evil incorporated',
    slug: 'doofenshmirtz-evil-incorporated',
    role: ['vp']
  }
]

export const members = [
  {
    status: 'orgadmin',
    person: people[2]._id,
    organisation: organisations[0]._id
  }
]

export const archivedOpportunities = [
  {
    _id: mongoose.Types.ObjectId(),
    type: OpportunityType.ASK,
    status: OpportunityStatus.COMPLETED,
    tags: [],
    requestor: people[0]._id
  }
]

export const activities = [
  {
    _id: mongoose.Types.ObjectId(),
    name: "1 What's my line - Careers panel game",
    imgUrl:
      'https://www.tvnz.co.nz/content/dam/images/news/2015/01/26/pacific-island-mentors-with-kelston-high-school-students.jpg.hashed.0d58ef7e.desktop.story.share.jpg',
    status: 'active'
  }
]

export const feedback = [
  {
    _id: mongoose.Types.ObjectId(),
    respondent: people[0]._id,
    activity: activities[0]._id,
    opportunity: archivedOpportunities[0]._id,
    respondentOrgs: [organisations[1]._id],
    rating: 2
  },
  {
    _id: mongoose.Types.ObjectId(),
    respondent: people[1]._id,
    activity: activities[0]._id,
    opportunity: archivedOpportunities[0]._id,
    respondentOrgs: [organisations[0]._id],
    rating: 3
  }
]

export const interestArchives = [
  {
    person: people[0],
    opportunity: archivedOpportunities[0]._id,
    status: InterestStatus.ATTENDED
  },
  {
    person: people[1],
    opportunity: archivedOpportunities[0]._id,
    status: InterestStatus.ATTENDED
  },
  {
    person: people[2],
    opportunity: archivedOpportunities[0]._id,
    status: InterestStatus.ATTENDED
  }
]
