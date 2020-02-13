const Story = require('./story')

/**
  api/stories/ -> list all the stories assigned to the opportunity and get the story details
 */

const listStory = async (req, res) => {
  const parentId = req.query.parentId
  const query = { parent: parentId }
  // Return enough info for a blog post
  const got = await Story.find(query)
    .populate('author', 'name imgUrl')
    .sort('-dateAdded').exec() // sorts the data by date in the server

  res.json(got)
}

const getStory = async (req, res) => {
  try {
    const got = await Story.findById(req.params._id)
      .populate('author', 'name imgUrl')
      .exec()
    res.json(got)
  } catch (e) {
    console.error(e)
    res.status(404).send(e)
  }
}

const putStory = async (req, res) => {
  await Story.findByIdAndUpdate(req.params._id, { $set: req.body })
  getStory(req, res)
}

module.exports = {
  listStory,
  getStory,
  putStory
}
