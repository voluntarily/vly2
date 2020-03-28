const Story = require('./story')
const { Action } = require('../../services/abilities/ability.constants')
const { Role } = require('../../services/authorize/role')

/**
  api/stories/ -> list all the stories assigned to the opportunity and get the story details
 */

const listStory = async (req, res) => {
  const query = {}

  if (req.query.parentId) {
    query.parent = req.query.parentId
  }

  // Return enough info for a blog post
  const got = await Story.find(query)
    .accessibleBy(req.ability, Action.LIST)
    .populate('author', 'name imgUrl')
    .sort('-createdAt').exec() // sorts the data by date in the server

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
  const storyToUpdate = await Story.findOne(req.params)
    .accessibleBy(req.ability, Action.READ)

  if (storyToUpdate === null) {
    return res.sendStatus(404)
  }

  const authorId = storyToUpdate.author ? storyToUpdate.author.toString() : undefined
  const meId = req.session.me ? req.session.me._id.toString() : undefined

  if (
    authorId !== meId &&
    !req.session.me.role.includes(Role.ADMIN)
  ) {
    // ensure non-admins can't take someone else's story and update the author to be themselves
    return res.sendStatus(404)
  }

  storyToUpdate.set(req.body)

  if (!req.ability.can(Action.UPDATE, storyToUpdate)) {
    return res.sendStatus(404)
  }

  try {
    await storyToUpdate.save()

    res.json(storyToUpdate)
  } catch (error) {
    return res.sendStatus(500)
  }
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
