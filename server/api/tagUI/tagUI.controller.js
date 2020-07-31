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

const getTagAliasSet = async (req, res) => {

}

const deleteTag = async (req, res) => {

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