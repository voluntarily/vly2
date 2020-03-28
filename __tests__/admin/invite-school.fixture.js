import Person from '../../server/api/person/person'
import SchoolLookUp from '../../server/api/school-lookup/school-lookup'
import { Role } from '../../server/services/authorize/role'
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
    name: 'Volunteer',
    email: 'volunteer@example.com',
    role: [Role.VOLUNTEER]
  }
]

const schools = [
  {
    schoolId: 1,
    name: 'Test School',
    telephone: '123 456 789',
    emailDomain: 'test.school.nz',
    website: 'https://www.test.school.nz',
    address: '1 Test St\nTesturb\nTestington',
    schoolType: 'Full Primary',
    decile: 5
  },
  {
    schoolId: 2,
    name: 'Test School 2',
    telephone: '123 456 788',
    emailDomain: 'test2.school.nz',
    website: 'https://www.test2.school.nz',
    address: '2 Test St\nTesturb\nTestington',
    schoolType: 'Full Primary',
    decile: 5
  },
  {
    schoolId: 3,
    name: 'Test School 3',
    telephone: '123 456 787',
    emailDomain: 'test3.school.nz',
    website: 'https://www.test3.school.nz',
    address: '3 Test St\nTesturb\nTestington',
    schoolType: 'Full Primary',
    decile: 5
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

  [loadedFixtures.people, loadedFixtures.schools] = await Promise.all([
    Person.create(people),
    SchoolLookUp.create(schools)
  ])

  return loadedFixtures
}

const clearInterestFixtures = async () => {
  await Promise.all([
    Person.deleteMany(),
    SchoolLookUp.deleteMany()
  ])
}

module.exports = {
  sessions,
  loadInterestFixtures,
  clearInterestFixtures
}
