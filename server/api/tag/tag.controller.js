const Tag = require('./tag')

/**
 * Creates one or more tags and sends a JSON response of the created objects
 */
function listTags (req, res) {
  Tag.findOne((err, fetched) => {
    if (err) {
      res.status(500).send(err)
    }
    res.json(fetched.tags)
  })
}

module.exports = {
  listTags
}
