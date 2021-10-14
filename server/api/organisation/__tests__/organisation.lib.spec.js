import test from 'ava'
import Organisation from '../organisation'
import orgs from './organisation.fixture.js'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { orgProfileCompleteness, orgProfileCompletenessById } from '../organisation.lib'
import objectid from 'objectid'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    t.context.orgs = await Organisation.create(orgs).catch(() => 'Unable to create orgs')
  } catch (e) { console.error('organisation.spec.js before error:', e) }
})

test.serial('Should correctly score each org', async t => {
  t.deepEqual(orgProfileCompleteness(orgs[0]), { score: 3, count: 7 })
  t.deepEqual(orgProfileCompleteness(orgs[1]), { score: 7, count: 10 })
  t.deepEqual(orgProfileCompleteness(orgs[5]), { score: 10, count: 10 })
})

test.serial('Should get and score from db id', async t => {
  await t.throwsAsync(async () => {
    await orgProfileCompletenessById('fakeid')
  }, { message: 'Cast to ObjectId failed for value "fakeid" (type string) at path "_id" for model "Organisation"' })
  t.is(await orgProfileCompletenessById(objectid()), false)
  t.deepEqual(await orgProfileCompletenessById(t.context.orgs[0]._id), { score: 3, count: 7 })
})
