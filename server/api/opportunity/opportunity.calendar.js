const ical = require('ical-generator')
const htmlSanitizer = require('sanitize-html')
const moment = require('moment')
const { config } = require('../../../config/clientConfig')

const getICalendar = (op) => {
  const calendar = ical({
    prodId: { company: 'Voluntarily', product: 'Invitation' },
    domain: 'voluntarily.nz',
    name: 'Welcome'
  })
  if (isEvent1DayOnly(op)) {
    addEventToIcalCalendar(calendar, op)
  }
  const icalString = calendar.toString()
  return {
    filename: 'invitation.ics',
    content: icalString
  }
}

const isEvent1DayOnly = (op) => {
  return op.date && op.date[1] == null && op.date[0] != null
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
    organizer: 'Voluntarily <team@voluntarily.nz>'
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

module.exports = {
  getICalendar
}
