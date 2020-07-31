const AliasSet = require('./aliasSet')
const { DefaultAliasSet } = require('./tagUI.constants')
const { listTags } = require('./../tag/tag.controller')

/**
 * Get all tags in the default tag collection ###### Change to get all tags from the alias list?
 * @param req
 * @param res
 * @returns void
 */
const getAllTags = async (req, res) => {
  //Redirect to tag.controller ListTags
  listTags(req, res)
}

/**
 * Get all tags and their aliases in the alias collection
 * @param req
 * @param res
 * @returns void
 */
const getAllTagAliasSets = async (req, res) => {
  let query = {}
  let sort = 'tag'
  let select = null

  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? req.query.p : null
  } catch (e) {
    // if there is something wrong with the query return a Bad Query
    return res.status(400).send(e)
  }

  try {
    const got = await AliasSet.find(query, select).sort(sort).exec()
    res.json(got)
  } catch (e) {
    // If we can't find a match return 404
    res.status(404).send(e)
  }
}

/**
 * Get a tag and its aliases from the alias collection
 * @param req
 * @param res
 * @returns void
 */
const getTagAliasSet = async (req, res) => {
  try {
    const { tag } = req.params

    if (!(await AliasSet.exists({ tag: tag }))) {
      return res.status(404).send({ error: 'Tag not found' })
    }

    const tagWithAliasSet = await AliasSet
      .findOne({ tag })

    res.json(tagWithAliasSet)
  } catch (e) {
    res.status(500).send({ error: e })
  }
}

/**
 * Delete a tag from the alias collection, and delete it from other alias lists
 * @param req
 * @param res
 * @returns void
 * Future TODO: Delete tag from tag list
 */
const deleteTag = async (req, res) => {
  try {
    var tagToDelete = req.params.tag

    if (!(await AliasSet.exists({ tag: tagToDelete }))) {//tagToDelete))) {
      return res.status(404).send({ error: 'Tag not found' })
    }

    //Delete tag from the aliases set of other tags
    const tagToDeleteWithAliases = await AliasSet
      .findOne({ tag: tagToDelete })

    const tagToDeleteAliases = tagToDeleteWithAliases.aliases
    if (tagToDeleteAliases.length == 0) {
      //tag has no aliases in the system
    } else {
      for (const tag of tagToDeleteAliases) {
        const tagWithAliases = await AliasSet
          .findOne({ tag })

        const otherAliases = tagWithAliases.aliases //List of aliases of which the tag to delete is a part of

        const index = otherAliases.indexOf(tagToDelete);
        if (index > -1) {
          otherAliases.splice(index, 1);
        }

        //Remove the tag from alias collection
        await AliasSet.updateOne({ tag: tagWithAliases.tag }, { aliases: otherAliases })
      }
    }

    //Delete tag from alias collection
    const aliasSet = await AliasSet
      .findOne({ tag: tagToDelete })
      .then(item => item.remove().then(() => res.json({ success: true })))
      .catch(err => res.status(404).json({ success: false }))

  } catch (e) {
    res.status(500).send({ error: e })
  }

}


const deleteTagAlias = async (req, res) => {

}

const editTag = async (req, res) => {

}

const editTagAlias = async (req, res) => {

}

const addTag = async (req, res) => {

}

const addTagToAliasSets = async (req, res) => {
  //New tag or existing tag?
}

const searchForTag = async (req, res) => {

}

const searchForTagAliasSet = async (req, res) => {

}


module.exports = {
  getAllTags,
  getAllTagAliasSets,
  getTagAliasSet,
  deleteTag,
  deleteTagAlias,
  editTag,
  editTagAlias,
  addTag,
  addTagToAliasSets,
  searchForTag,
  searchForTagAliasSet
}