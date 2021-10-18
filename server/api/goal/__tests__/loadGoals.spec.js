import test from 'ava'
import { loadGoals } from '../loadGoals'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import Goal from '../goal'
import goals from './goal.fixture.js'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  try {
    t.context.goals = await Goal.create(goals).catch((e) => console.error('Unable to create goals', e))
  } catch (e) { console.error('goal.spec.js before error:', e) }
})

test('Should correctly give count of all goals sorted by rank', async t => {
  let count = await Goal.countDocuments()
  t.is(count, goals.length)
  await loadGoals()
  count = await Goal.countDocuments()
  t.is(count, 14) // union of the two sources
})
