const Activity = require('./activity')
const Organisation = require('../organisation/organisation')
const escapeRegex = require('../../util/regexUtil')
/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
const getActivities = async (req, res) => {
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

  try {
    if (req.query.search) {
      const search = req.query.search.trim()
      const regexSearch = escapeRegex(search)
      const searchExpression = new RegExp(regexSearch, 'i')
      // find any organization matching search
      const matchingOrgIds = await Organisation.find({ name: searchExpression }, '_id').exec()

      // split around one or more whitespace characters
      const keywordArray = search.split(/\s+/)

      const searchParams = {
        $or: [
          { name: searchExpression },
          { subtitle: searchExpression },
          { description: searchExpression },
          { tags: { $in: keywordArray } }
        ]
      }
      // mongoose isn't happy if we provide an empty array as an expression
      if (matchingOrgIds.length > 0) {
        const orgIdExpression = {
          $or: matchingOrgIds.map(id => ({ offerOrg: id }))
        }
        searchParams.$or.push(orgIdExpression)
      }
      query = {
        $and: [
          searchParams,
          query
        ]
      }
    }

    try {
      const got = await Activity.find(query, select).sort(sort).exec()
      res.json(got)
    } catch (e) {
      res.status(404).send(e)
    }
  } catch (e) {
    return res.status(500).send(e)
  }
}
const getActivity = async (req, res) => {
  try {
    const got = await Activity.findOne(req.params)
      .populate('owner', 'name nickname imgUrl')
      .populate('offerOrg', 'name imgUrl category')
      .exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}

const putActivity = async (req, res) => {
  await Activity.findByIdAndUpdate(req.params._id, { $set: req.body })
  getActivity(req, res)
}

module.exports = {
  getActivities,
  getActivity,
  putActivity
}
