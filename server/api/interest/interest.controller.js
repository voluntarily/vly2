const Interest = require('./interest')
const Person = require('../person/person')
const { config } = require('../../../config/serverConfig')
const { emailPerson } = require('../person/person.email')
const { InterestStatus } = require('./interest.constants')
const ical = require('ical-generator')
const htmlSanitizer = require('sanitize-html')
const moment = require('moment')
const { Action } = require('../../services/abilities/ability.constants')

/**
  api/interests -> list all interests
  api/interests?op='opid' -> lists all interests associated with opid.
  api/interests?op='opid'&me='personid' -> lists all interests (hopefully only 0 or 1) associated with opid and personid.
  api/interests?me='personid' -> list all the ops i'm interested in and populate the op out.
 */
const listInterests = async (req, res) => {
  const sort = 'dateAdded' // todo sort by date.

  try {
    const find = {}
    const populateList = []

    if (req.query.op) {
      find.opportunity = req.query.op
      populateList.push({ path: 'person', select: 'nickname name imgUrl' })
    }

    if (req.query.me) {
      find.person = req.query.me
      populateList.push({ path: 'opportunity' })
    }

    const query = Interest.find(find)

    for (const populate of populateList) {
      query.populate(populate)
    }

    const interests = (await query
      .accessibleBy(req.ability, Action.LIST)
      .sort(sort)
      .exec())
      .filter(opportunity => opportunity.person !== null)

    res.json(interests)
  } catch (err) {
    // console.error(err)
    res.status(404).send(err)
  }
}

const getInterest = async (req, res, next) => {
  try {
    const interest = await Interest
      .accessibleBy(req.ability, Action.READ)
      .findOne(req.params)

    if (interest === null) {
      return res.status(404).send()
    }

    res.json(interest)
  } catch (e) {
    res.status(500).send()
  }
}

const getInterestDetail = async (interestID) => {
  // Get the interest and populate out key information needed for emailing
  const interestDetail = await Interest.findById(interestID)
    .populate({ path: 'person', select: 'nickname name email pronoun language sendEmailNotifications' })
    .populate({ path: 'opportunity', select: 'name requestor imgUrl date duration' })
    .exec()

  const requestorDetail = await Person.findById(interestDetail.opportunity.requestor, 'name nickname email imgUrl sendEmailNotifications')
  interestDetail.opportunity.requestor = requestorDetail
  interestDetail.opportunity.imgUrl = `${config.appUrl}${interestDetail.opportunity.imgUrl}`
  interestDetail.opportunity.href = `${config.appUrl + '/ops/' + interestDetail.opportunity._id}`
  interestDetail.person.href = `${config.appUrl + '/people/' + interestDetail.person._id}`
  return interestDetail
}

const createInterest = async (req, res) => {
  const interestData = req.body

  if (!interestData.person) {
    interestData.person = (req.session.me && req.session.me._id) ? req.session.me._id : undefined
  }

  const interest = new Interest(interestData)

  if (!req.ability.can(Action.CREATE, interest)) {
    return res.sendStatus(403)
  }

  try {
    await interest.save()

    const interestDetail = await getInterestDetail(interest._id)
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
    const result = await Interest
      .accessibleBy(req.ability, Action.UPDATE)
      .updateOne(req.params, { $set: { status: req.body.status } })

    if (result.nModified === 0) {
      return res.sendStatus(404)
    }

    const interestDetail = await getInterestDetail(req.params._id)
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

const deleteInterest = async (req, res, next) => {
  try {
    const result = await Interest
      .accessibleBy(req.ability, Action.DELETE)
      .deleteOne(req.params)

    if (result.deletedCount === 0) {
      return res.sendStatus(404)
    }

    return res.status(200).send(req.params)
  } catch (e) {
    console.error(e)
    return res.sendStatus(500)
  }
}

module.exports = {
  listInterests,
  getInterest,
  updateInterest,
  createInterest,
  deleteInterest
}
