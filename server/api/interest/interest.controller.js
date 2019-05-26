const Interest = require('./interest')
const Person = require('../person/person')
const Opportunity = require('../opportunity/opportunity')
const sanitizeHtml = require('sanitize-html')
// const { emailPerson } = require('./email/emailperson')

/**
  api/interests -> list all interests
  api/interests?op='opid' -> lists all interests associated with opid.
  api/interests?op='opid'&me='personid' -> lists all interests (hopefully only 0 or 1) associated with opid and personid.
 */
const listInterests = async (req, res) => {
  let sort = 'dateAdded' // todo sort by date.
  let interestsArray
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
    res.json(got)
  } catch (err) {
    res.status(404).send(err)
  }
}

const updateInterest = async (req, res) => {
  try {
    await Interest.update({ _id: req.body._id }, { $set: { status: req.body.status } }).exec()

    res.json(req.body)
  } catch (err) {
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
    res.json(got)
  })
}

async function maybeInnovativelyDestructivelySendEmailPossibly(volunteerId, organizerId, prevStatus, currentStatus, modifier) {

  if (modifier == 'volunteer') {

    if (currentStatus == 'interested') { // A volunteer just clicked "interested"
      console.log('A volunteer just clicked "interested"')

    } else if (currentStatus == 'committed') { // A volunteer accepts an invitation
      console.log('A volunteer accepts an invitation')
    }

  } else {

    if (currentStatus == 'interested') { // An organizer just withdrew an invite
      console.log('An organizer just withdrew an invite')

    } else if (currentStatus == 'invited') { // An organizer just sent an invite
      console.log('An organizer just sent an invite')

    } else if (currentStatus == 'declined') { // An organizer just declined someone
      console.log('An organizer just declined someone')
    }

  }

}

module.exports = {
  listInterests,
  updateInterest,
  createInterest
}
