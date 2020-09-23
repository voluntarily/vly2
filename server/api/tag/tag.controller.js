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
    const q = { name: (req.query && req.query.name) || DefaultTagList }
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

const editATag = async (req, res) => {
  try {
    var originalTag = req.params.tag
    var newTag = req.body.edittedTag

    // const tagList = await Tag.findone({name: 'default'}, 'tags' )
    const q = { name: (req.query && req.query.name) || DefaultTagList }
    const tagList = await Tag.findOne(q, 'tags', { lean: true })

    const tagArray = tagList.tags

    const index = tagArray.indexOf(originalTag)
    if (index > -1) {
      tagArray[index] = newTag
    } else {
      return res.status(404).send({ error: 'Tag not found in taglist' })
    }

    // Edit the tag in the taglist collection
    await Tag.updateOne({ name: 'default', tags: tagArray })
      .then(() => res.json({ success: true }))
      .catch(err => res.status(404).json({ success: false }).send({ error: err }))
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

module.exports = {
  listTags,
  editATag
}
