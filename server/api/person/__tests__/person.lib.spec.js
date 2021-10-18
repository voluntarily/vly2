import test from 'ava'
import Person from '../person'
import people from './person.fixture.js'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { personProfileCompleteness, personProfileCompletenessById, getUnsubscribeLink } from '../person.lib'
import objectid from 'objectid'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    t.context.people = await Person.create(people).catch((e) => console.error('Unable to create people', e))
  } catch (e) { console.error('person.spec.js before error:', e) }
})

test.serial('Should correctly score each person', async t => {
  t.deepEqual(personProfileCompleteness(people[0]), { score: 9, count: 9 })
  t.deepEqual(personProfileCompleteness(people[1]), { score: 7, count: 9 })
  t.deepEqual(personProfileCompleteness(people[5]), { score: 6, count: 9 })
})

test.serial('Should get and score from db id', async t => {
  await t.throwsAsync(async () => {
    await personProfileCompletenessById('fakeid')
  }, { message: 'Cast to ObjectId failed for value "fakeid" (type string) at path "_id" for model "Person"' })
  t.is(await personProfileCompletenessById(objectid()), false)

  const res = await personProfileCompletenessById(t.context.people[0]._id)
  t.deepEqual(res, { score: 9, count: 9 })
})

test('getUnsubscribeLink - with _id', (t) => {
  const link = getUnsubscribeLink({ _id: 'test-id' })
  t.truthy(link.includes('/people/test-id'))
})

test('getUnsubscribeLink - without _id', (t) => {
  const error = t.throws(() => {
    getUnsubscribeLink({})
  })

  t.is(error.message, 'Expected a person object with an _id field')
})
