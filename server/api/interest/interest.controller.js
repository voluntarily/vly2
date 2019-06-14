const Interest = require('./interest')
const Person = require('../person/person')
// const Opportunity = require('../opportunity/opportunity')
const { emailPerson } = require('../person/email/emailperson')

/**
  api/interests -> list all interests
  api/interests?op='opid' -> lists all interests associated with opid.
  api/interests?op='opid'&me='personid' -> lists all interests (hopefully only 0 or 1) associated with opid and personid.
  api/interests?me='personid' -> list all the ops i'm interested in and populate the op out.
 */
const listInterests = async (req, res) => {
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
    } else if (req.query.me) {
      const query = { person: req.query.me }
      got = await Interest.find(query).populate({ path: 'opportunity' }).sort(sort).exec()
    } else {
      got = await Interest.find().sort(sort).exec()
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
    const interesetPersonID = req.body.person
    const { opportunity } = req.body
    const { title } = opportunity

    const { requestor } = req.body.opportunity

    // This will perform actual database query so it will return as undefined in test
    if (process.env.NODE_ENV !== 'test') {
      Person.findById(interesetPersonID, (err, person) => {
        if (err) console.log(err)
        else sendEmailNotification(requestor, person, title) // This method will send to both requestor and person
      })
    }

    const got = await Interest.findOne({ _id: saved._id }).populate({ path: 'person', select: 'nickname' }).exec()
    res.json(got)
  })
}

const sendEmailNotification = (requestor, volunteer, volunteerEvent) => {
  requestor.volunteerEvent = volunteerEvent
  requestor.volunteerName = volunteer.nickname
  volunteer.volunteerEvent = volunteerEvent

  const emailProps = {
    send: true
  }

  emailPerson(volunteer, 'acknowledgeInterest', emailProps)
  emailPerson(requestor, 'RequestorNotificationEmail', emailProps)
}

// async function maybeInnovativelyDestructivelySendEmailPossibly (volunteerId, organizerId, prevStatus, currentStatus, modifier) {
//   if (modifier == 'volunteer') {
//     if (currentStatus == 'interested') { // A volunteer just clicked "interested"
//       console.log('A volunteer just clicked "interested"')
//     } else if (currentStatus == 'committed') { // A volunteer accepts an invitation
//       console.log('A volunteer accepts an invitation')
//     }
//   } else {
//     if (currentStatus == 'interested') { // An organizer just withdrew an invite
//       console.log('An organizer just withdrew an invite')
//     } else if (currentStatus == 'invited') { // An organizer just sent an invite
//       console.log('An organizer just sent an invite')
//     } else if (currentStatus == 'declined') { // An organizer just declined someone
//       console.log('An organizer just declined someone')
//     }
//   }
// }

module.exports = {
  listInterests,
  updateInterest,
  createInterest
}
