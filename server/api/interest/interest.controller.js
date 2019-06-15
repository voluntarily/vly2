const Interest = require('./interest')
const Person = require('../person/person')
const Opportunity = require('../opportunity/opportunity')
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

    const { opportunity, status, person } = req.body // person in here is the volunteer-- quite not good naming here
    Opportunity.findById(opportunity, (err, opportunityFound) => {
      if (err) console.log(err)
      else {
        processStatusToSendEmail(status, opportunityFound, person)
      }
    })
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
      const { comment } = req.body
      requestor.volunteerComment = comment
      Person.findById(interesetPersonID, (err, volunteer) => {
        if (err) console.log(err)
        else {
          requestor.emailTemplate = 'RequestorNotificationEmail'
          volunteer.emailTemplate = 'acknowledgeInterest'
          sendEmailInformBoth(requestor, volunteer, title) // This method will send to both requestor and person
        }
      })
    }

    const got = await Interest.findOne({ _id: saved._id }).populate({ path: 'person', select: 'nickname' }).exec()
    res.json(got)
  })
}

/**
 * Quite different from the processStatusToSendEmail this function will send email to both requestor and volunteer inform a new interest created
 * @param {*} requestor
 * @param {*} volunteer
 * @param {*} volunteerEvent The title of it
 */
const sendEmailInformBoth = (requestor, volunteer, volunteerEvent) => {
  requestor.volunteerEvent = volunteerEvent
  requestor.volunteerName = volunteer.nickname
  volunteer.volunteerEvent = volunteerEvent
  const emailProps = {
    send: true
  }

  emailPerson(volunteer, volunteer.emailTemplate, emailProps)
  emailPerson(requestor, requestor.emailTemplate, emailProps)
}

const processStatusToSendEmail = (interestStatus, opportunity, volunteer) => {
  const { _id, nickname } = volunteer
  const { requestor, title } = opportunity
  if (interestStatus === 'invited' || interestStatus === 'declined') {
    // send email to volunteer
    sendEmailBaseOn(interestStatus, _id, title)
  } else if (interestStatus === 'committed') {
    // send email to requestor
    sendEmailBaseOn(interestStatus, requestor, title, nickname)
  }
}

/**
 * This will be easier to add more status without having too much if. All we need is add another folder in email template folder and the status will reference to that folder
 * @param {*} status status will be used to indicate which email template to use
 * @param {*} personID so we can find the email of that person
 * @param {*} opportunityTitle just making the email content clearer
 * @param {*} volunteerNickname optional this only be used to inform requestor when volunteer is commited
 */
const sendEmailBaseOn = (status, personID, opportunityTitle, volunteerNickname = '') => {
  console.log('The status is ', status)
  Person.findById(personID, (err, person) => {
    if (err) console.log(err)
    else {
      const emailProps = {
        send: true
      }
      person.email = 'emma.lockman76@ethereal.email'
      person.volunteerEvent = opportunityTitle
      person.volunteerNickname = volunteerNickname
      emailPerson(person, status, emailProps)
    }
  })
}

// Possible states of the opportunity
// 1 ->Intertested
// 2 ->Invited
// 3 ->Declined
// 4 ->Commited

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
