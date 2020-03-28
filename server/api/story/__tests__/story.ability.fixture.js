import Person from '../../person/person'
import Story from '../story'
import { Role } from '../../../services/authorize/role'
import mongoose from 'mongoose'
import { generateTestSession } from '../../../util/test-generate-session'
import { StoryStatus } from '../story.constants'

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
  }
]

const stories = [
  {
    _id: generateObjectId(),
    name: 'Test 1',
    status: StoryStatus.PUBLISHED
  },
  {
    _id: generateObjectId(),
    name: 'Test 2',
    status: StoryStatus.PUBLISHED
  },
  {
    _id: generateObjectId(),
    name: 'Test 3',
    status: StoryStatus.PUBLISHED
  },
  {
    _id: generateObjectId(),
    name: 'Test 4',
    status: StoryStatus.PUBLISHED,
    author: people[1]._id
  },
  {
    _id: generateObjectId(),
    name: 'Test 5',
    status: StoryStatus.PUBLISHED,
    author: people[2]._id
  },
  {
    _id: generateObjectId(),
    name: 'Test 6',
    status: StoryStatus.DRAFT,
    author: people[1]._id
  },
  {
    _id: generateObjectId(),
    name: 'Test 7',
    status: StoryStatus.DRAFT,
    author: people[2]._id
  },
  {
    _id: generateObjectId(),
    name: 'Test 8',
    status: StoryStatus.DELETED,
    author: people[1]._id
  },
  {
    _id: generateObjectId(),
    name: 'Test 9',
    status: StoryStatus.DELETED,
    author: people[2]._id
  },
  {
    _id: generateObjectId(),
    name: 'Test 10',
    status: StoryStatus.DRAFT
  }
]

const sessions = []

for (const person of people) {
  const session = generateTestSession(person.name, person.email)

  sessions.push(session)
}

const loadInterestFixtures = async () => {
  const loadedFixtures = {}

  loadedFixtures.people = await Person.create(people)
  loadedFixtures.stories = await Story.create(stories)

  return loadedFixtures
}

const clearInterestFixtures = async () => {
  await Promise.all([
    Person.deleteMany(),
    Story.deleteMany()
  ])
}

module.exports = {
  sessions,
  loadInterestFixtures,
  clearInterestFixtures
}
