const Interest = require('./interest')
const Person = require('../person/person')

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
      got = await Interest.find(query).sort(sort).exec()
    } else {
      got = await Interest.find().sort(sort).exec()
    }

    for (let i = 0; i < got.length; i++) {
      person = await Person.findOne({ _id: got[i].person }).exec()
      // console.log('PERSON IN SERVER BRO')
      // console.log(person)
      console.log(`Name: ${person.name}, Email: ${person.email}`)
      got[i].personName = person.name
      got[i].personEmail = person.email
    }

    // console.log(got)
    res.json(got)
  } catch (err) {
    console.log(err)
    res.status(404).send(err)
  }
}

const listInterestsWithPeopleDetails = async (req, res) => {
  let sort = 'dateAdded' // todo sort by date.
  let got
  try {
    if (req.query.op) {
      const query = { opportunity: req.query.op }
      if (req.query.me) {
        query.person = req.query.me
      }
      got = await Interest.find(query).sort(sort).exec()
    } else {
      got = await Interest.find().sort(sort).exec()
    }

    for (let i = 0; i < got.length; i++) {
      person = await Person.findOne({ _id: got[i].person }).exec()
      console.log('PERSON IN SERVER BRO')
      console.log(person)
    }

    // console.log(got)
    res.json(got)
  } catch (err) {
    console.log(err)
    res.status(404).send(err)
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
  listInterests
}
