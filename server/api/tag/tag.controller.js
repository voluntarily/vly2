const Tag = require('./tag')

/**
 * Creates one or more tags and sends a JSON response of the created objects
 */
function createTags (req, res) {
  console.log('custom!!')
  Tag.create(req.body, (err, saved) => {
    if (err) {
      res.status(500).send(err)
    }
    res.json(saved)
  })
}

module.exports = {
  createTags
}
