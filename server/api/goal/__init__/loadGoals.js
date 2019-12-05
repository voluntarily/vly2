import Goal from '../goal'
import goals from './goal.init.js'

export const loadGoals = async () => {
  await Goal
    .deleteMany({})
  await Goal
    .create(goals)
    .catch((e) => console.error('Unable to create goals', e))
}
