import test from 'ava'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import MemoryMongo from '../../../util/test-memory-mongo'
import { isEmailVerified, setEmailVerified } from '../verified'
import { PersonalVerificationStatus } from '../personalVerification.constants'
const { PersonFields } = require('../../person/person.constants')

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await Person.create(people)
})

const testy = {
  name: 'Testy McTestface',
  nickname: 'testy',
  email: 'testy@voluntarily.nz',
  about: 'a test person',
  locations: ['Auckland'],
  role: ['volunteer'],
  status: 'active',
  imgUrl: 'https://avatars2.githubusercontent.com/u/1596437?v=4',
  verified: []
}

test('create a person and set new email verified', async t => {
  const t1 = { ...testy }
  const me = await Person.create(t1)
  t.is(me.verified.length, 0)
  t.false(isEmailVerified(me))
  await setEmailVerified(PersonalVerificationStatus.VERIFIED, 'newtesty@voluntarily.nz', me)

  const found = await Person.findById(me._id)
  t.is(found.verified.length, 1)
  t.is(found.verified[0].name, PersonFields.EMAIL)
  t.is(found.verified[0].status, PersonalVerificationStatus.VERIFIED)
  t.is(found.verified[0].value, 'newtesty@voluntarily.nz')
  t.true(isEmailVerified(found))
})

test('create a person and set email verified when other verifies are present', async t => {
  const t1 = {
    ...testy,
    email: 'testy2@voluntarily.nz',
    verified: [
      { name: PersonFields.NAME, status: PersonalVerificationStatus.VERIFIED },
      { name: PersonFields.DOB, status: PersonalVerificationStatus.VERIFIED }
    ]
  }
  const me = await Person.create(t1)
  await setEmailVerified(PersonalVerificationStatus.VERIFIED, t1.email, me)

  const found = await Person.findById(me._id)
  t.is(found.verified.length, 3)
  const email = found.verified.find(item => item.name === PersonFields.EMAIL)
  t.is(email.name, PersonFields.EMAIL)
  t.is(email.status, PersonalVerificationStatus.VERIFIED)
})

test('create a person and remove email verified when other verifies are present', async t => {
  const t1 = {
    ...testy,
    email: 'testy3@voluntarily.nz',
    verified: [
      { name: PersonFields.NAME, status: PersonalVerificationStatus.VERIFIED },
      { name: PersonFields.EMAIL, status: PersonalVerificationStatus.VERIFIED },
      { name: PersonFields.DOB, status: PersonalVerificationStatus.VERIFIED }
    ]
  }
  const me = await Person.create(t1)
  await setEmailVerified(PersonalVerificationStatus.NOT_VERIFIED, t1.email, me)

  const found = await Person.findById(me._id)
  t.is(found.verified.length, 3)
  const email = found.verified.find(item => item.name === PersonFields.EMAIL)
  t.is(email.name, PersonFields.EMAIL)
  t.is(email.status, PersonalVerificationStatus.NOT_VERIFIED)
})

test('create a person and set email verified when it is already set', async t => {
  const t1 = {
    ...testy,
    email: 'testy4@voluntarily.nz',
    verified: [
      { name: PersonFields.NAME, status: PersonalVerificationStatus.VERIFIED },
      { name: PersonFields.EMAIL, status: PersonalVerificationStatus.VERIFIED },
      { name: PersonFields.DOB, status: PersonalVerificationStatus.VERIFIED }
    ]
  }
  const me = await Person.create(t1)
  await setEmailVerified(PersonalVerificationStatus.VERIFIED, t1.email, me)
  const found = await Person.findById(me._id)
  t.is(found.verified.length, 3)
  const email = found.verified.find(item => item.name === PersonFields.EMAIL)
  t.is(email.name, PersonFields.EMAIL)
  t.is(email.status, PersonalVerificationStatus.VERIFIED)
})
