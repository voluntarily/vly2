const Interest = require('./interest')
const Person = require('../person/person')
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
  const sort = 'dateAdded' // todo sort by date.
  let got
  try {
    if (req.query.op) {
      const query = { opportunity: req.query.op }
      if (req.query.me) {
        query.person = req.query.me
      }
      // Return the nickname in person field
      got = await Interest.find(query).populate({ path: 'person', select: 'nickname name imgUrl' }).sort(sort).exec()
    } else if (req.query.me) {
      const query = { person: req.query.me }
      got = await Interest.find(query).populate({ path: 'opportunity' }).sort(sort).exec()
    } else {
      got = await Interest.find().sort(sort).exec()
    }
    res.json(got)
  } catch (err) {
    // console.error(err)
    res.status(404).send(err)
  }
}

const getInterestDetail = async (interestID) => {
  // Get the interest and populate out key information needed for emailing
  const interestDetail = await Interest.findById(interestID)
    .populate({ path: 'person', select: 'nickname name email pronoun language' })
    .populate({ path: 'opportunity', select: 'name requestor imgUrl date duration' })
    .exec()

  const requestorDetail = await Person.findById(interestDetail.opportunity.requestor, 'name nickname email imgUrl')
  interestDetail.opportunity.requestor = requestorDetail
  interestDetail.opportunity.href = `${config.appUrl + '/ops/' + interestDetail.opportunity._id}`
  interestDetail.person.href = `${config.appUrl + '/people/' + interestDetail.person._id}`
  return interestDetail
}

const createInterest = async (req, res) => {
  const newInterest = new Interest(req.body)
  try {
    await newInterest.save()

    const interestDetail = await getInterestDetail(newInterest._id)
    sendInterestedEmail('acknowledgeInterest', interestDetail.person, interestDetail)
    sendInterestedEmail('interested', interestDetail.opportunity.requestor, interestDetail)
    res.json(interestDetail)
  } catch (err) {
  // console.log(err)
    res.status(422).send(err)
  }
}

const updateInterest = async (req, res) => {
  try {
    await Interest.updateOne({ _id: req.body._id }, { $set: { status: req.body.status } }).exec()
    const interestDetail = await getInterestDetail(req.body._id)
    processStatusToSendEmail(interestDetail.status, interestDetail)
    res.json(interestDetail)
  } catch (err) {
    // console.error(err)
    res.status(404).send(err)
  }
}

const processStatusToSendEmail = (template, interest) => {
  const op = interest.opportunity
  const volunteer = interest.person
  const requestor = interest.opportunity.requestor

  const calendar = ical({
    prodId: { company: 'Voluntarily', product: 'Invitation' },
    domain: 'voluntarily.nz',
    name: 'Welcome'
  })
  if (isEvent1DayOnly(op)) {
    addEventToIcalCalendar(calendar, op)
  }
  const icalString = calendar.toString()
  switch (template) {
    case InterestStatus.INVITED:
      sendInterestedEmail(template, volunteer, interest, {
        attachment: [{
          filename: 'invitation.ics',
          content: icalString
        }]
      })
      break
    case InterestStatus.DECLINED:
      sendInterestedEmail(template, volunteer, interest)
      break
    case InterestStatus.COMMITTED:
      sendInterestedEmail(template, requestor, interest)
      break
  }
}

const isEvent1DayOnly = (opportunity) => {
  return opportunity.date && opportunity.date[1] == null && opportunity.date[0] != null
}

const addEventToIcalCalendar = (icalCalendar, opportunity) => {
  const durationStringInISO = convertDurationStringToISO(opportunity.duration)
  const duration = moment.duration(durationStringInISO).isValid() ? moment.duration(durationStringInISO) : moment(0, 'second')
  const cleanEventDescription = htmlSanitizer(opportunity.description, {
    allowedTags: [],
    allowedAttributes: {}
  })
  const event = icalCalendar.createEvent({
    start: moment(opportunity.date[0]),
    end: moment(opportunity.date[0]).add(duration),
    timestamp: moment(),
    summary: `Voluntarily event: ${opportunity.name}`,
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

/**
 * This will be easier to add more status without having too much if. All we need is add another folder in email template folder and the status will reference to that folder
 * @param {string} template status will be used to indicate which email template to use
 * @param {object} to person email is for. (requestor or volunteer) with email populated.
 * @param {object} interest populated out interest with person and op.
 * @param {object} props extra properties such as attachment
 */
const sendInterestedEmail = async (template, to, interest, props) => {
  const op = interest.opportunity
  await emailPerson(template, to, {
    send: true,
    op,
    from: op.requestor,
    ...props
  })
}

module.exports = {
  listInterests,
  updateInterest,
  createInterest
}
