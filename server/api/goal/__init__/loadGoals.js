import Goal from '../goal'
import PersonalGoal from '../../personalGoal/personalGoal'
import goals from './goal.init.js'

export const loadGoals = async () => {
  await PersonalGoal.deleteMany({})
  await Goal.deleteMany({})
  await Goal
    .create(goals)
    .catch((e) => console.error('Unable to create goals', e))
}
