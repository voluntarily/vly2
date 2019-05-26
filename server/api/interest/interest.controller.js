const Interest = require('./interest')

/**
  api/interests -> list all interests
  api/interests?op='opid' -> lists all interests associated with opid.
  api/interests?op='opid'&me='personid' -> lists all interests (hopefully only 0 or 1) associated with opid and personid.
 */
const listInterests = async (req, res) => {
  // console.log(req.query)
  let sort = 'dateAdded' // todo sort by date.
  let got
  try {
    if (req.query.op) {
      const query = { opportunity: req.query.op }
      if (req.query.me) {
        query.person = req.query.me
      }
      // Return the nickname in person field
      got = await Interest.find(query).populate({ path: 'person', select: 'nickname' }).sort(sort).exec()
    } else {
      got = await Interest.find().populate({ path: 'person', select: 'nickname' }).sort(sort).exec()
    }
    // console.log(got)
    res.json(got)
  } catch (err) {
    console.log(err)
    res.status(404).send(err)
  }
}

const updateInterest = async (req, res) => {
  let got
  try {
    got = await Interest.update({ _id: req.body._id }, { $set: { status: req.body.status } }).exec()
    console.log(got)

    res.json(req.body)
  } catch (err) {
    console.log(err)
    res.status(404).send(err)
  }
}

const createInterest = async (req, res) => {
  const newInterest = new Interest(req.body)
  newInterest.save(async (err, saved) => {
    if (err) {
      res.status(500).send(err)
    }
    const got = await Interest.findOne({ _id: saved._id }).populate({ path: 'person', select: 'nickname' }).exec()
    console.log(got)
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
  listInterests,
  updateInterest,
  createInterest
}
