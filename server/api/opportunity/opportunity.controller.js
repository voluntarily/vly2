const Opportunity = require('./opportunity')

/**
 * Get all orgs
 * @param req
 * @param res
 * @returns void
 */
async function getOpportunities (req, res) {
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

  let got
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
    got = await Opportunity.find(query, select).sort(sort).exec()
    res.json(got)
  } catch (e) {
    res.status(404).send(e)
  }
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
  getOpportunities
}
