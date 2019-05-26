const Opportunity = require('./opportunity')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
function getOpportunities (req, res) {
  // console.log(req.query)
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
  Opportunity.find(query, select).sort(sort).exec((err, got) => {
    if (err) {
      console.log(err)
      res.status(404).send(err)
    }
    // console.log(got)
    res.json(got)
  })
}
function getOpportunity (req, res) {
  // console.log(req.query)
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
  Opportunity.findOne(query).populate('requestor').sort(sort).exec((err, got) => {
    if (err) {
      console.log(err)
      res.status(404).send(err)
    }
    console.log('yyyyyyyyyyy',got)
    res.json(got)
  })
}

// /**
//  * Save an org
//  * @param req
//  * @param res
//  * @returns void
//  */
// export function addOrganisation (req, res) {
//   if (!req.body.organisation.name || !req.body.organisation.about) {
//     res.status(403).end()
//   }

//   const newOrganisation = new Organisation(req.body.organisation)

//   // Let's sanitize inputs
//   newOrganisation.name = sanitizeHtml(newOrganisation.name)
//   newOrganisation.about = sanitizeHtml(newOrganisation.about)

//   newOrganisation.slug = slug(newOrganisation.name.toLowerCase(), { lowercase: true })
//   newOrganisation.save((err, saved) => {
//     if (err) {
//       res.status(500).send(err)
//     }
//     res.json({ organisation: saved })
//   })
// }

// /**
//  * Delete a organisation
//  * @param req
//  * @param res
//  * @returns void
//  */
// export function deleteOrganisation (req, res) {
//   Organisation.findOne({ cuid: req.params.cuid }).exec((err, organisation) => {
//     if (err) {
//       res.status(500).send(err)
//     }

//     organisation.remove(() => {
//       res.status(200).end()
//     })
//   })
// }

module.exports = {
  getOpportunities,
  getOpportunity
}
