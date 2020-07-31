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


const getAllTagAliasSets = async (req, res) => {

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