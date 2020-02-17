const Tag = require('../api/tag/tag')
const { DefaultTagList } = require('../api/tag/tag.constants')

const initializeTags = async (req, res, next) => {
  try {
    const { tags } = req.body
    if (tags) {
      try {
        const tagset = await Tag.findOne({ name: DefaultTagList }).exec()
        if (tagset) {
          const currentTags = new Set(tagset.tags)
          tags.forEach(x => {
            if (!currentTags.has(x)) {
              currentTags.add(x)
              tagset.tags = new Array(...currentTags)
            }
          })
          await tagset.save()
        } else {
          await Tag.create({ name: DefaultTagList, tags: tags })
        }
      } catch (error) {
        console.error('Failed to fetch tags to append to', error)
      }
    }
    next()
  } catch (e) {
    console.error('Failed to store tags', e)
    res.status(500).send(e)
  }
}

module.exports = initializeTags
