const moment = require('moment')
const { getMembersWithAttendedInterests, parseStatisticsTimeframe } = require('./statistics.lib')
const Organisation = require('../organisation/organisation')
const { Role } = require('../../services/authorize/role')

const getSummary = async (req, res) => {
  const { orgId, timeframe } = req.params

  // authentication
  const currentUser = req.session.me
  if (!currentUser || !req.session.isAuthenticated) {
    return res.status(401).send()
  }

  // authorisation
  if (!Array.isArray(currentUser.role) || !currentUser.role.includes(Role.ORG_ADMIN) || !Array.isArray(currentUser.orgAdminFor) || !currentUser.orgAdminFor.includes(orgId)) {
    return res.status(403).send()
  }

  let afterDate
  try {
    afterDate = parseStatisticsTimeframe(timeframe)
  } catch (e) {
    return res.status(400).send({ message: e.message })
  }

  try {
    // the volunteers for an organisation are those that have attended an opportunity
    if (!(await Organisation.exists({ _id: orgId }))) {
      return res.status(404).send({ error: 'Organisation not found' })
    }
    const membersWithAttendedInterests = await getMembersWithAttendedInterests(orgId, afterDate)

    const totalVolunteers = membersWithAttendedInterests.length
    const totalDuration = moment.duration()

    // accumulate total hours for each opportunity attended by each member
    membersWithAttendedInterests.forEach(member => {
      member.opportunitiesAttended.forEach(opportunity => {
        totalDuration.add(moment.duration(opportunity.duration))
      })
    })

    const totalHours = totalDuration.asHours()
    const avgHoursPerVolunteer = totalVolunteers ? totalHours / totalVolunteers : 0

    res.send({
      totalVolunteers,
      totalHours,
      avgHoursPerVolunteer
    })
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
}

const getLocations = async (req, res) => {
  const { orgId, timeframe } = req.params

  // authentication
  const currentUser = req.session.me
  if (!currentUser || !req.session.isAuthenticated) {
    return res.status(401).send()
  }

  // authorisation
  if (!Array.isArray(currentUser.role) || !currentUser.role.includes(Role.ORG_ADMIN) || !Array.isArray(currentUser.orgAdminFor) || !currentUser.orgAdminFor.includes(orgId)) {
    return res.status(403).send()
  }

  let afterDate
  try {
    afterDate = parseStatisticsTimeframe(timeframe)
  } catch (e) {
    return res.status(400).send({ message: e.message })
  }

  try {
    // the volunteers for an organisation are those that have attended an opportunity
    if (!(await Organisation.exists({ _id: orgId }))) {
      return res.status(404).send({ error: 'Organisation not found' })
    }
    const membersWithAttendedInterests = await getMembersWithAttendedInterests(orgId, afterDate)

    // consolidate location (city) opportunity data
    const locationsMap = {}
    membersWithAttendedInterests.forEach(member => {
      member.opportunitiesAttended.forEach(opportunity => {
        let city = (opportunity.locations ? opportunity.locations[0] : opportunity.location) || 'unknown'
        city = city.toLowerCase()

        // increment city count
        if (city in locationsMap) {
          locationsMap[city]++
        } else {
          locationsMap[city] = 1
        }
      })
    })

    // convert locations map to array for client consumption
    const locationsArray = Object.keys(locationsMap).map(city => ({ name: city, value: locationsMap[city] }))

    res.send(locationsArray)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
}

const getActivityTags = async (req, res) => {
  const { orgId, timeframe } = req.params

  // authentication
  const currentUser = req.session.me
  if (!currentUser || !req.session.isAuthenticated) {
    return res.status(401).send()
  }

  // authorisation
  if (!Array.isArray(currentUser.role) || !currentUser.role.includes(Role.ORG_ADMIN) || !Array.isArray(currentUser.orgAdminFor) || !currentUser.orgAdminFor.includes(orgId)) {
    return res.status(403).send()
  }

  let afterDate
  try {
    afterDate = parseStatisticsTimeframe(timeframe)
  } catch (e) {
    return res.status(400).send({ message: e.message })
  }

  try {
    // the volunteers for an organisation are those that have attended an opportunity
    if (!(await Organisation.exists({ _id: orgId }))) {
      return res.status(404).send({ error: 'Organisation not found' })
    }
    const membersWithAttendedInterests = await getMembersWithAttendedInterests(orgId, afterDate)

    // consolidate location (city) opportunity data
    const activityTagsMap = {}
    membersWithAttendedInterests.forEach(member => {
      member.opportunitiesAttended.forEach(opportunity => {
        const tags = opportunity.tags
        if (!tags) {
          return
        }

        // tags counts are divided by the number of tags per opportunity
        // so that one opporunity with a lot of tags cannot skew the statistics
        // from other opportunities with a low amount of tags
        const weightedCount = 1 / tags.length

        tags.forEach(tag => {
          tag = tag.toLowerCase()
          if (tag in activityTagsMap) {
            activityTagsMap[tag] += weightedCount
          } else {
            activityTagsMap[tag] = weightedCount
          }
        })
      })
    })

    // convert locations map to array for client consumption
    const activityTagsArray = Object.keys(activityTagsMap).map(tag => ({ name: tag, value: activityTagsMap[tag] }))

    res.send(activityTagsArray)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
}

module.exports = {
  getSummary,
  getLocations,
  getActivityTags
}
