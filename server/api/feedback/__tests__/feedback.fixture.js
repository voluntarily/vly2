import { OpportunityStatus, OpportunityType } from '../../opportunity/opportunity.constants'
import mongoose from 'mongoose'

export const people = [
  {
    _id: mongoose.Types.ObjectId(),
    name: 'Andrew',
    email: 'andrew@groat.nz',
    role: ['admin']
  }
]

export const opportunities = [
  {
    _id: mongoose.Types.ObjectId(),
    type: OpportunityType.ASK,
    status: OpportunityStatus.ACTIVE,
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
    opportunity: opportunities[0]._id,
    respondentOrgs: [],
    rating: 2
  }
]
