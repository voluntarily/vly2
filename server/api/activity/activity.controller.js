const Activity = require('./activity')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
const getActivities = async (req, res) => {
  let query = {} // { status: 'active' }
  let sort = 'title'
  let select = {}

  try {
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? JSON.parse(req.query.p) : select
  } catch (e) {
    console.log('bad JSON', req.query)
    return res.status(400).send(e)
  }

  if (req.query.search) {
    const searchExpression = new RegExp(req.query.search, 'i')
    const searchParams = {
      $or: [
        { 'title': searchExpression },
        { 'subtitle': searchExpression },
        { 'description': searchExpression },
        { 'tags.tag': searchExpression }
      ]
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
}
const getActivity = async (req, res) => {
  try {
    const got = await Activity.findOne(req.params).populate('owner').populate('tags').exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
}

const putActivity = async (req, res) => {
  try {
    await Activity.findByIdAndUpdate(req.params._id, { $set: req.body })
    getActivity(req, res)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

module.exports = {
  getActivities,
  getActivity,
  putActivity
}
