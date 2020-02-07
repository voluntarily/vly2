const Story = require('./story')
/**
  api/stories/ -> list all the stories assigned to the opportunity and get the sytory details
 */

// const listPersonalGoals = async (req, res) => {
//   // if (!req.session || !req.session.isAuthenticated) { return res.status(403).end() }

//   const me = req.query.parentId
//   try {
//     await evaluatePersonalGoals(me, req)
//   } catch (err) {
//     res.status(500)
//   }
//   // Return enough info for a goalCard
//   const got = await PersonalGoal.find({ parent=parentId })
//     .populate({ path: 'goal' })
//     .populate({ path: 'person', select: 'nickname name imgUrl' })
//     .sort('status').exec()

//   res.json(got)
// }
const getStory = async (req, res) => {
  try {
    const got = await Story.findOne(req.params)
      .populate('author', 'name imgUrl')
      .exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}

const putStory = async (req, res) => {
  await Story.findByIdAndUpdate(req.params._id, { $set: req.body })
  getStory(req, res)
}
// list stories,

module.exports = {
  getStory,
  putStory
}