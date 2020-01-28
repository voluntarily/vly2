const Goal = require('./goal')
const goals = require('./__init__/goal.init.js')

const loadGoals = async () => {
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

module.exports = { loadGoals }
