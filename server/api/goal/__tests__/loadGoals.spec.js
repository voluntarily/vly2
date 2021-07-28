import test from 'ava'
import { loadGoals } from '../loadGoals'
import MemoryMongo from '../../../util/test-memory-mongo'
import Goal from '../goal'
import goals from './goal.fixture.js'

test.before('before connect to database', async (t) => {
  try {
    t.context.memMongo = new MemoryMongo()
    await t.context.memMongo.start()
    t.context.goals = await Goal.create(goals).catch((e) => console.error('Unable to create goals', e))
  } catch (e) { console.error('goal.spec.js before error:', e) }
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test('Should correctly give count of all goals sorted by rank', async t => {
  let count = await Goal.countDocuments()
  t.is(count, goals.length)
  await loadGoals()
  count = await Goal.countDocuments()
  t.is(count, 13) // union of the two sources
})
