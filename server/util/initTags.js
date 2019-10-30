const Tag = require('../api/tag/tag')

const initializeTags = async (req, res, next) => {
  try {
    const { tags } = req.body
    if (tags) {
      try {
        let tagset = await Tag.findOne({ name: 'person' }).exec()
        if (tagset) {
          let currentTags = new Set(tagset.tags)
          tags.forEach(x => {
            if (!currentTags.has(x)) {
              currentTags.add(x)
              tagset.tags = new Array(...currentTags)
            }
          })
          await tagset.save()
        } else {
          await Tag.create({ name: 'person', tags: tags })
        }
      } catch (error) {
        console.log('Failed to fetch tags to append to', error)
      }
      next()
    }
  } catch (e) {
    console.error('qwerty', e)
    res.status(500).send(e)
  }
}

module.exports = initializeTags
