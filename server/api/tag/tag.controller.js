const Tag = require('./tag')
const { DefaultTagList } = require('./tag.constants')

/**
 * Creates one or more tags and sends a JSON response of the created objects
 * /api/tags?[name="aname"]
 * name = optional dictionary name, otherwise use the default list
 */
async function listTags (req, res) {
  try {
    // note: currently we just return the first tag collection.
    const q = { name: req.query.name || DefaultTagList }
    const fetched = await Tag.findOne(q, 'tags', { lean: true })
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
