import mongoose from 'mongoose'
import moment from 'moment'

const generateObjectId = mongoose.Types.ObjectId

const firstOrgId = generateObjectId()

const organisations = [
  {
    _id: firstOrgId,
    name: 'Volunteer Provider 1',
    slug: 'volunteer-provider-1',
    role: ['vp']
  },
  {
    _id: generateObjectId(),
    name: 'Volunteer Provider 2',
    slug: 'volunteer-provider-2',
    role: ['vp']
  }
]

const people = [
  {
    // 0
    _id: generateObjectId(),
    name: 'Volunteer 1',
    email: 'volunteer.1@example.com',
    role: ['volunteer']
  },
  {
    // 1
    _id: generateObjectId(),
    name: 'Volunteer 2',
    email: 'volunteer.2@example.com',
    role: ['volunteer']
  },
  {
    // 2
    _id: generateObjectId(),
    name: 'Volunteer 3',
    email: 'volunteer.3@example.com',
    role: ['volunteer']
  },
  {
    // 3
    _id: generateObjectId(),
    name: 'requestor',
    email: 'requestor@example.com',
    role: ['volunteer']
  }
]

// Two members from the same organisation and one member in another organisation
const members = [
  {
    _id: generateObjectId(),
    status: 'orgadmin',
    person: people[0]._id,
    organisation: firstOrgId
  },
  {
    _id: generateObjectId(),
    status: 'member',
    person: people[1]._id,
    organisation: firstOrgId
  },
  {
    _id: generateObjectId(),
    status: 'member',
    person: people[2]._id,
    organisation: organisations[1]._id
  }
]

const sixMonthsAgo = moment().subtract(6, 'months').toDate()
const threeYearsAgo = moment().subtract(3, 'years').toDate()

// Each member has an interest in four opportunities
const archivedOpportunities = [
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'PT2H20M',
    locations: ['Auckland', 'Auckland'],
    tags: ['JavaScript', 'React']
  },
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'PT1H20M',
    locations: ['Auckland', 'Auckland'],
    tags: []
  },
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'PT3H',
    locations: ['Auckland', 'Auckland'],
    tags: ['Robots']
  },
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'PT25M',
    locations: ['Wellington', 'Wellington'],
    tags: ['Python', 'react']
  },
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'PT1H50M',
    locations: ['Online', 'Online'],
    tags: ['Public speaking', 'DevOps', 'JavaScript', 'Python']
  },
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'P1DT2H20M',
    locations: ['Auckland', 'Auckland'],
    tags: ['Baking', 'DevOps']
  },
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'P1DT1H20M',
    locations: ['Wellington', 'Wellington'],
    tags: ['Baking', 'DevOps']
  },
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'PT3H20M',
    locations: ['Wellington', 'Wellington'],
    tags: ['iOS', 'DevOps']
  },
  {
    _id: generateObjectId(),
    date: [sixMonthsAgo, null],
    requestor: people[3]._id,
    duration: 'PT1H10M',
    locations: ['Wellington', 'Wellington'],
    tags: ['Public speaking', 'GoLang']
  },
  {
    _id: generateObjectId(),
    date: [threeYearsAgo, null],
    requestor: people[3]._id,
    duration: 'PT5H20M',
    locations: ['Auckland', 'Auckland'],
    tags: ['ASP.NET Core', 'C#']
  },
  {
    _id: generateObjectId(),
    date: [threeYearsAgo, null],
    requestor: people[3]._id,
    duration: 'PT6H20M',
    locations: ['Auckland', 'Auckland'],
    tags: ['Docker', 'DevOps']
  },
  {
    _id: generateObjectId(),
    date: [threeYearsAgo, null],
    requestor: people[3]._id,
    duration: 'PT7H20M',
    locations: ['Auckland', 'Auckland'],
    tags: ['Kubernetes', 'Containerisation', 'Block Chain', 'Machine Learning', 'Artifical Intelligence']
  }
]

// Each member attends 2 opporunities in the last six months, attends 1 in the last three
// years and 1 not attended
const interestArchives = [
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[0].person,
    opportunity: archivedOpportunities[0]._id
  },
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[0].person,
    opportunity: archivedOpportunities[1]._id
  },
  {
    _id: generateObjectId(),
    status: 'not_attended',
    person: members[0].person,
    opportunity: archivedOpportunities[2]._id
  },
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[0].person,
    opportunity: archivedOpportunities[9]._id
  },
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[1].person,
    opportunity: archivedOpportunities[3]._id
  },
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[1].person,
    opportunity: archivedOpportunities[4]._id
  },
  {
    _id: generateObjectId(),
    status: 'not_attended',
    person: members[1].person,
    opportunity: archivedOpportunities[5]._id
  },
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[1].person,
    opportunity: archivedOpportunities[10]._id
  },
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[2].person,
    opportunity: archivedOpportunities[6]._id
  },
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[2].person,
    opportunity: archivedOpportunities[7]._id
  },
  {
    _id: generateObjectId(),
    status: 'not_attended',
    person: members[2].person,
    opportunity: archivedOpportunities[8]._id
  },
  {
    _id: generateObjectId(),
    status: 'attended',
    person: members[2].person,
    opportunity: archivedOpportunities[11]._id
  }
]

const activities = [
  {
    _id: generateObjectId(),
    name: "1 What's my line - Careers panel game",
    imgUrl:
      'https://www.tvnz.co.nz/content/dam/images/news/2015/01/26/pacific-island-mentors-with-kelston-high-school-students.jpg.hashed.0d58ef7e.desktop.story.share.jpg',
    status: 'active'
  }
]

const feedback = [
  {
    respondent: people[0]._id,
    respondentOrgs: [organisations[0]._id],
    opportunity: archivedOpportunities[0]._id,
    activity: activities[0]._id,
    rating: 1
  },
  {
    respondent: people[0]._id,
    respondentOrgs: [organisations[0]._id],
    opportunity: archivedOpportunities[0]._id,
    activity: activities[0]._id,
    rating: 1
  },
  {
    respondent: people[0]._id,
    respondentOrgs: [organisations[0]._id],
    opportunity: archivedOpportunities[0]._id,
    activity: activities[0]._id,
    rating: 4
  },
  {
    respondent: people[0]._id,
    respondentOrgs: [organisations[0]._id],
    opportunity: archivedOpportunities[9]._id,
    activity: activities[0]._id,
    rating: 1
  },
  {
    respondent: people[0]._id,
    respondentOrgs: [organisations[1]._id],
    opportunity: archivedOpportunities[0]._id,
    activity: activities[0]._id,
    rating: 4
  }
]

module.exports = {
  firstOrgId,
  organisations,
  people,
  members,
  archivedOpportunities,
  interestArchives,
  activities,
  feedback
}
