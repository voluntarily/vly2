import test from 'ava'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import SchoolLookUp from '../school-lookup'
import schoolLookUpFixtures from './school-lookup.fixture'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {

})

test('fixture data loads', async (t) => {
  const schoolCount = await SchoolLookUp.countDocuments()
  t.is(schoolCount, 0)

  await SchoolLookUp.create(schoolLookUpFixtures)
  const newSchoolCount = await SchoolLookUp.countDocuments()
  t.is(newSchoolCount, 1)
})

test('missing required fields throw error', async (t) => {
  const requiredFields = SchoolLookUp.schema.requiredPaths(true)

  const error = await t.throwsAsync(SchoolLookUp.create({}))

  for (const requiredField of requiredFields) {
    t.assert(
      error.message.includes(requiredField),
      `The "${requiredField}" required fields is not included in error message`
    )
  }
})

test('school type creation with invalid schoolType throws error', async (t) => {
  await t.throwsAsync(SchoolLookUp.create({
    schoolId: 1,
    emailDomain: 'test.school.nz',
    schoolType: 'Invalid school type'
  }))
})
