const Tag = require('../api/tag/tag')
const { DefaultTagList, GroupTagList } = require('../api/tag/tag.constants')

const initializeTagsA = taglist => async (req, res, next) => {
  try {
    const { tags, groups } = req.body
    if (tags || groups) {
      try {
        const tagset = await Tag.findOne({ name: taglist }).exec()
        if (tagset) {
          const currentTags = new Set(tagset.tags)
          if(tags) {
            tags.forEach(x => {
              if (!currentTags.has(x)) {
                currentTags.add(x)
                tagset.tags = new Array(...currentTags)
              }
            })
          }
          if (groups) {  
            groups.forEach(x => {
              if (!currentTags.has(x)) {
                currentTags.add(x)
                tagset.tags = new Array(...currentTags)
              }
            })
          }
          await tagset.save()
        } else {
          await Tag.create({ name: taglist, tags: tags })
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

const initializeTags = initializeTagsA(DefaultTagList)
// console.log(initializeTags)
const initializeGroups = initializeTagsA(GroupTagList)

module.exports = {
  initializeTags,
  initializeGroups
}
