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
    // console.log('Updating interest with req body of ', req.body)
    await Interest.update({ _id: req.body._id }, { $set: { status: req.body.status } }).exec()

    const interesetPersonID = req.body.person
    let personInterestInOP = await Person.findById(interesetPersonID, (err, res) => {
      if (err) console.log(err)
      else {
        console.log(res)
      }
    })
    personInterestInOP.email = 'kobebryant0304@gmail.com'
    // const sendingInfo = emailPerson(personInterestInOP, 'acknowledgeInterest', {})
    // console.log('Sending info is ', sendingInfo)
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
        // We only catch if there is any error
        sendEmailNotification(requestor, person, title) // This method will send to both requestor and person
      })
    }

    // personInterestInOP.email = 'kobebryant0304@gmail.com'
    // personInterestInOP.email = 'emma.lockman76@ethereal.email'

    // emailPerson(personInterestInOP, 'acknowledgeInterest', emailProps)

    // To see if the email sent successfully uncomment bellow
    // const sendingInfo = await emailPerson(personInterestInOP, 'acknowledgeInterest', emailProps)
    // console.log('Sending info is sent to ', sendingInfo.accepted)
    // console.log('Sending email has a response of ', sendingInfo.response)

    const got = await Interest.findOne({ _id: saved._id }).populate({ path: 'person', select: 'nickname' }).exec()
    res.json(got)
  })
}

const sendEmailNotification = (requestor, volunteer, volunteerEvent) => {
  volunteer.email = 'kobebryant0304@gmail.com'
  requestor.email = 'kobebryant0304@gmail.com'
  requestor.volunteerEvent = volunteerEvent
  requestor.volunteerName = volunteer.nickname
  volunteer.volunteerEvent = volunteerEvent

  const emailProps = {
    send: true
  }

  emailPerson(volunteer, 'acknowledgeInterest', emailProps)
  emailPerson(requestor, 'RequestorNotificationEmail', emailProps)

  volunteer.email = ''
  requestor.email = ''
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
