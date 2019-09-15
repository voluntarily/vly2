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
  let select = {}

  try {
    console.log(req.query)
    query = req.query.q ? JSON.parse(req.query.q) : query
    sort = req.query.s ? JSON.parse(req.query.s) : sort
    select = req.query.p ? req.query.p : select
    console.log('select', select)
    Organisation.find(query, select).sort(sort)
      .then(got => {
        res.json(got)
      })
  } catch (e) {
    console.log('Bad request', req.query)
    return res.status(400).send(e)
  }
}

module.exports = {
  getOrganisations
}
