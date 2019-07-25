const Tag = require('./../tag/tag')

const initializeTags = async (req, res, next) => {
  try {
    const { tags } = req.body
    if (tags) {
    // all tags that don't have an id property need to be created
      const newTags = tags.filter(t => !t._id)
      const createdTags = await Tag.create(newTags)

      // opportunity controller expects an array of tag ids
      req.body.tags = [
        ...createdTags.map(t => t._id), // the new ids
        ...tags.filter(t => t._id).map(t => t._id) // the pre-existing ids
      ]
    }
    next()
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

module.exports = initializeTags
