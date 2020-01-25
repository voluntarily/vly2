const Story = require('./story')

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

module.exports = {
  getStory,
  putStory
}
