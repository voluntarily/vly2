const SchoolLookUp = require('./school-lookup')

const getSchools = async (req, res) => {
  let query = {}
  let sort = 'name'
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
    const got = await SchoolLookUp.find(query, select)
      .sort(sort)
      .collation({ locale: 'en_US', strength: 1 })
      .exec()

    res.json(got)
  } catch (e) {
    // If we can't find a match return 404
    res.status(404).send(e)
  }
}

module.exports = {
  getSchools
}
