const Organisation = require('./organisation')
const Tag = require('../tag/tag')
const escapeRegex = require('../../util/regexUtil')

// import slug from 'limax'
// import sanitizeHtml from 'sanitize-html'

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */

const getOrganisations = async (req, res) => {
  let query = {} // { status: 'active' }
  let sort = 'name'
  let select = {}

  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? JSON.parse(req.query.p) : select
  } catch (e) {
    return res.status(400).send(e)
  }

  // try {
  // TODO: [VP-508] Add searching for orgs by category, name and tags
  //   if (req.query.search) {
  //     const search = req.query.search.trim()
  //     const regexSearch = escapeRegex(search)

  //     // split around one or more whitespace characters
  //     const keywordArray = search.split(/\s+/)

  //     // case insensitive regex which will find tags matching any of the array values
  //     const tagSearchExpression = new RegExp(keywordArray.map(w => escapeRegex(w)).join('|'), 'i')

  //     // find tag ids to include in the opportunity search
  //     const matchingTagIds = await Tag.find({ 'tag': tagSearchExpression }, '_id').exec()
  //     const searchExpression = new RegExp(regexSearch, 'i')
  //     const searchParams = {
  //       $or: [
  //         { 'name': searchExpression },
  //         { 'info': searchExpression },
  //       ]
  //     }

  //     // mongoose isn't happy if we provide an empty array as an expression
  //     if (matchingTagIds.length > 0) {
  //       const tagIdExpression = {
  //         $or: matchingTagIds.map(id => ({ 'tags': id }))
  //       }
  //       searchParams.$or.push(tagIdExpression)
  //     }
  //     query = {
  //       $and: [
  //         searchParams,
  //         query
  //       ]
  //     }
  //   }

  try {
    const got = await Organisation.find(query, select).sort(sort).exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
  // } catch (e) {
  //   return res.status(500).send(e)
  // }
}

module.exports = {
  getOrganisations
}
