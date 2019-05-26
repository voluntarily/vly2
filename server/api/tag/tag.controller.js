// // import sanitizeHtml from 'sanitize-html'

// /**
//  * Get a given tag
//  */

// // take the request body, and search for the tag in the tag schema, based on the value (case-insensitive)
// const Tag = require('./tag')

// /**
//  * Get a tag object
//  * @param req
//  * @param res
//  * @returns void
//  */
// function getTag (req, res) {
//   let tagName = ''

//   try {
//     if (req.query.tags) {
//       tagName = req.query.tags
//     }
//   } catch (e) {
//     console.log('Bad request parameters', req.query)
//     return res.status(400).send(e)
//   }
//   Tag.find({ tag: tagName }).exec((err, got) => {
//     if (err) {
//       console.log(err)
//       res.status(404).send(err)
//     }
//     // console.log(got)
//     res.json(got)
//   })
// }

// /**
//  * Create a tag object
//  * @param req
//  * @param res
//  * @returns Tag
//  */
// function createTag (req, res) {
//   let tagName = ''
//   try {
//     if (req.query.tags) {
//       tagName = req.query.tags
//     }
//   } catch (e) {
//     console.log('Bad request parameters', req.query)
//     return res.status(400).send(e)
//   }
//   Tag.find({ tag: tagName }).exec((err, got) => {
//     if (err) {
//       console.log(err)
//       res.status(404).send(err)
//     }
//     // console.log(got)
//     res.json(got)
//   })
// }

// /**
//  * Save a tag
//  * @param req
//  * @param res
//  * @returns void
//  */
// export function addTag (req, res) {
//   if (!req.body.tag.tag) {
//     res.status(403).end()
//   }

//   const newTag = new Tag(req.body.tag)

//   // Let's sanitize inputs
//   //newTag.tag = sanitizeHtml(newTag.tag)

//   newTag.save((err, saved) => {
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

// module.exports = {
//   getTag,
//   createTag
// }
