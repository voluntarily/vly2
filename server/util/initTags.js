const Tag = require('../api/tag/tag')

const initializeTags = async (req, res, next) => {
  try {
    const { tags } = req.body
    if (tags) {
      console.log(tags)
      console.log('I am here !!!!')

      // await Tag.create({ name: 'person', tags: [1,2] })
      try {
        let tagset = await Tag.findOne({ name: 'person' }).exec()
        if (tagset) {
          tagset.tags.push(...tags)
          await tagset.save()
        } else {
          await Tag.create({ name: 'person', tags: tags })
        }
      } catch (error) {
        console.log('Error', error)
        await Tag.create({ name: 'person', tags: tags })
      }
      next()
      //console.log('dfgs', ret)
      // all tags that don't have an id property need to be created
      // const newTags = tags.filter(t => !t._id)
      // let createdTags = await Tag.create(newTags)
      // createdTags = createdTags || []

      // // opportunity controller expects an array of tag ids
      // req.body.tags = [
      //   ...createdTags.map(t => t._id), // the new ids
      //   ...tags.filter(t => t._id).map(t => t._id) // the pre-existing ids
      // ]
    }
  } catch (e) {
    console.error('qwerty', e)
    res.status(500).send(e)
  }
}

module.exports = initializeTags
