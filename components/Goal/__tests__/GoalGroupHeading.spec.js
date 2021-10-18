import test from 'ava'
import { goalGroupHeading } from '../GoalGroupHeading'
import { GoalGroup } from '../../../server/api/goal/goalGroup'

test('There are known goal groups and a default ', t => {
  Object.keys(GoalGroup).forEach(key => {
    const heading = goalGroupHeading(GoalGroup[key])
    t.true(Object.keys(heading).includes('title'))
    t.not(heading[GoalGroup[key]], GoalGroup[key])
  })

  // check default
  const defaultHeading = goalGroupHeading('Test')
  t.deepEqual(defaultHeading.title, { id: 'Test' })
})
