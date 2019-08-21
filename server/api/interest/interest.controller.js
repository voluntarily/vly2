const Interest = require('./interest')
const Person = require('../person/person')
const Opportunity = require('../opportunity/opportunity')
const { config } = require('../../../config/config')
const { emailPerson } = require('../person/email/emailperson')
const { InterestStatus } = require('./interest.constants')
const ical = require('ical-generator')
const htmlSanitizer = require('sanitize-html')
const moment = require('moment')

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
      got = await Interest.find(query).populate({ path: 'person', select: 'nickname name avatar' }).sort(sort).exec()
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
    // await Interest.updateOne({ _id: req.body._id }, { $set: { status: req.body.status } }).exec()
    const { opportunity, status, person } = req.body // person in here is the volunteer-- quite not good naming here
    Opportunity.findById(opportunity, (err, opportunityFound) => {
      if (err) throw err
      else processStatusToSendEmail(status, opportunityFound, person)
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
      return res.status(500).send(err)
    }
    const volunteerID = req.body.person
    const { opportunity } = req.body
    const { title } = opportunity
    const { requestor } = req.body.opportunity
    const opId = opportunity._id
    const { comment } = req.body
    requestor.volunteerComment = comment

    sendEmailBaseOn('acknowledgeInterest', volunteerID, title, opId)
    sendEmailBaseOn('RequestorNotificationEmail', requestor._id, title, opId, comment)
    const got = await Interest.findOne({ _id: saved._id }).populate({ path: 'person', select: 'nickname' }).exec()
    res.json(got)
  })
}

const processStatusToSendEmail = (interestStatus, opportunity, volunteer) => {
  const { _id } = volunteer
  const { requestor, title } = opportunity
  const opID = opportunity._id

  let icalString
  const calendar = ical({
    prodId: { company: 'voluntarily', product: 'Invitation' },
    domain: 'voluntarily.nz',
    name: 'Welcome'
  })
  if (isEvent1DayOnly(opportunity)) {
    addEventToIcalCalendar(calendar, opportunity)
  }

  icalString = calendar.toString()
  if (interestStatus === InterestStatus.INVITED) {
    const emailProps = {
      send: true,
      attachment: [{
        filename: 'invitation.ics',
        content: icalString
      }]
    }
    sendEmailWithAttachment(volunteer._id, InterestStatus.INVITED, emailProps)
  } else if (interestStatus === InterestStatus.DECLINED) {
    // send email to volunteer only
    sendEmailBaseOn(interestStatus, _id, title, opID) // The _id in here is the volunteer id
  } else if (interestStatus === InterestStatus.COMMITTED) {
    // send email to requestor only
    sendEmailBaseOn(interestStatus, requestor, title, opID)
  }
}

const isEvent1DayOnly = (opportunity) => {
  return opportunity.date[1] == null && opportunity.date[0] != null
}

const addEventToIcalCalendar = (icalCalendar, opportunity) => {
  let durationStringInISO = convertDurationStringToISO(opportunity.duration)
  const duration = moment.duration(durationStringInISO).isValid() ? moment.duration(durationStringInISO) : moment(0, 'second')
  const cleanEventDescription = htmlSanitizer(opportunity.description, {
    allowedTags: [],
    allowedAttributes: {}
  })
  const event = icalCalendar.createEvent({
    start: moment(opportunity.date[0]),
    end: moment(opportunity.date[0]).add(duration),
    timestamp: moment(),
    summary: `Voluntarily event: ${opportunity.title}`,
    description: `${cleanEventDescription}`,
    url: `${config.appUrl}/ops/${opportunity._id}`,
    organizer: 'Voluntarily <team@voluntari.ly>'
  })
  event.createAlarm({
    type: 'display',
    trigger: moment.duration(1, 'hour') // Trigger alarm before event 1 hour
  })
}

const convertDurationStringToISO = (durationString) => {
  let filteredOutCharacter = durationString.replace(/[^mhy/\d]/g, '')
  filteredOutCharacter = filteredOutCharacter.toUpperCase()
  return `PT${filteredOutCharacter}` // ISO string for duration start with PT character first
}

const sendEmailWithAttachment = async (personId, status, emailProps) => {
  const receiver = await Person.findById(personId).exec()
  emailPerson(receiver, status, emailProps)
}

/**
 * This will be easier to add more status without having too much if. All we need is add another folder in email template folder and the status will reference to that folder
 * @param {string} status status will be used to indicate which email template to use
 * @param {string} personID so we can find the email of that person
 * @param {string} opportunityTitle Just making the email content clearer
 * @param {string} opId To construct url that link to the opportunity
 * @param {string} volunteerCommment (optional) This is only for requestor notification email only,default is empty string
 */
const sendEmailBaseOn = async (status, personID, opportunityTitle, opId, volunteerComment = '') => {
  let opUrl = `${config.appUrl + '/ops/' + opId}`
  await Person.findById(personID, (err, person) => {
    if (err) console.log(err)
    else {
      const emailProps = {
        send: true
      }
      person.opUrl = opUrl
      person.volunteerEvent = opportunityTitle
      person.volunteerComment = volunteerComment
      emailPerson(person, status, emailProps)
    }
  })
}

// Possible states of the opportunity
// 1 ->Intertested
// 2 ->Invited
// 3 ->Declined
// 4 ->Commited

module.exports = {
  listInterests,
  updateInterest,
  createInterest
}
