const Story = require('./story')
const { Action } = require('../../services/abilities/ability.constants')

/**
  api/stories/ -> list all the stories assigned to the opportunity and get the story details
 */

const listStory = async (req, res) => {
  const parentId = req.query.parentId
  const query = { parent: parentId }
  // Return enough info for a blog post
  const got = await Story.find(query)
    .accessibleBy(req.ability, Action.LIST)
    .populate('author', 'name imgUrl')
    .sort('-dateAdded').exec() // sorts the data by date in the server

  res.json(got)
}

const getStory = async (req, res) => {
  try {
    const got = await Story.findById(req.params._id)
      .accessibleBy(req.ability, Action.READ)
      .populate('author', 'name imgUrl')
      .exec()

    if (got === null) {
      return res.sendStatus(404)
    }

    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}

const putStory = async (req, res) => {
  await Story.findByIdAndUpdate(req.params._id, { $set: req.body })
  getStory(req, res)
}

const createStory = async (req, res) => {
  const story = new Story(req.body)

  if (!req.ability.can(Action.CREATE, story)) {
    return res.sendStatus(403)
  }

  try {
    await story.save()

    res.json(story)
  } catch (error) {
    return res.sendStatus(500)
  }
}

module.exports = {
  listStory,
  getStory,
  putStory,
  createStory
}
