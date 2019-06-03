const Organisation = require('./organisation')
// import slug from 'limax'
// import sanitizeHtml from 'sanitize-html'

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
function getOrganisations (req, res) {
  let query = {}
  let sort = 'name'
  let select = ''
  try {
    query = req.query.q ? JSON.parse(req.query.q) : {}
    sort = req.query.s ? JSON.parse(req.query.s) : 'name'
    select = req.query.p ? JSON.parse(req.query.p) : {}

    Organisation.find(query, select).sort(sort)
      .then(got => {
        res.json(got)
      })
  } catch (e) {
    console.log('bad JSON', req.query)
    return res.status(400).send(e)
  }
}

module.exports = {
  getOrganisations
}
