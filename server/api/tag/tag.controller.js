const Tag = require('./tag')

/**
 * Creates one or more tags and sends a JSON response of the created objects
 */
async function listTags (req, res) {
  try {
    // note: currently we just return the first tag collection.
    // there's no way to identify other dictionaries.
    const fetched = await Tag.findOne({}, 'tags', { lean: true })

    let responseData = []

    if (fetched && fetched.tags) {
      responseData = fetched.tags
    }

    res.json(responseData)
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = {
  listTags
}
