const Story = require('./story')

/**
 * Creates one or more stories and sends a JSON response of the created objects
 */
async function listStories (req, res) {
  try {
    const fetched = await Story.findOne({}, 'stories', { lean: true })

    let responseData = []

    if (fetched && fetched.stories) {
      responseData = fetched.stories
    }

    res.json(responseData)
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = {
  listStories
}
