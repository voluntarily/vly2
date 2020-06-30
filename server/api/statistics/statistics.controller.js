const moment = require('moment')
const {getMembersWithAttendedInterests} = require('./statistics.lib')

const getSummary = async (req, res) => {
  const { orgId, timeframe } = req.params

  let afterDate
  switch (timeframe) {
    case 'month':
      afterDate = moment().subtract(1, 'months').toDate()
      break
    case 'year':
      afterDate = moment().subtract(1, 'years').toDate()
      break
    default:
      return res.status(400).send({ message: 'invalid timeframe: must be month/year' })
  }

  try {
    // the volunteers for an organisation are those that have attended an opportunity
    const membersWithAttendedInterests = await getMembersWithAttendedInterests(orgId, afterDate)

    const totalVolunteers = membersWithAttendedInterests.length
    const totalDuration = moment.duration();

    // accumulate total hours for each opportunity attended by each member
    membersWithAttendedInterests.forEach(member => {
      member.opportunitiesAttended.forEach(opportunity => {
        totalDuration.add(moment.duration(opportunity.duration))
      })
    })
   
    const totalHours = totalDuration.asHours() 
    const avgHoursPerVolunteer =  totalVolunteers ? totalHours / totalVolunteers : 0; 

    res.send({
      totalVolunteers,
      totalHours,
      avgHoursPerVolunteer
    })
  } catch (e) {
    res.status(500).send({error: e.message})
  }
}

module.exports = {
  getSummary
}
