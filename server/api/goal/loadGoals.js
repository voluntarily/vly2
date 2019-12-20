import Goal from './goal'
import goals from './__init__/goal.init.js'

export const loadGoals = async () => {
  return Promise.all(
    goals.map(async goal => {
      return Goal.findOneAndUpdate(
        { // check for a match
          slug: goal.slug
        },
        goal, // create or upsert
        { new: true, upsert: true }
      )
    })
  )
}
