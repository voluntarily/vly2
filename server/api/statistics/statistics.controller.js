const { InterestArchive } = require('../interest/interest')
const Member = require('../member/member')
const mongoose = require('mongoose')
const moment = require('moment')

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

    const membersWithAttendedInterests = await Member.aggregate([
      // find members in organisation with orgId
      { $match: { organisation: mongoose.Types.ObjectId(orgId) } },
      // populate the archived interests for each member
      {
        $lookup: {
          from: InterestArchive.collection.name,
          localField: 'person',
          foreignField: 'person',
          as: 'archivedInterests'
        }
      },
      // filter to have only attended archived interests
      {
        $addFields: {
          archivedInterests: {
            $filter: {
              input: '$archivedInterests',
              cond: {
                $eq: ['$$archivedInterests.status', 'attended']
              },
              as: 'archivedInterests'
            }
          }
        }
      },
      // populate archived opportunities for each archived interest
      {
        $lookup: {
          from: 'archivedopportunities',
          localField: 'archivedInterests.opportunity',
          foreignField: '_id',
          as: 'opportunitiesAttended'
        }
      },
      // filter opportunites within the given timeframe
      {
        $addFields: {
          opportunitiesAttended: {
            $filter: {
              input: '$opportunitiesAttended',
              cond: {
                $gt: [
                  {
                    $arrayElemAt: ['$$opportunitiesAttended.date', 0]
                  },
                  afterDate
                ]
              },
              as: 'opportunitiesAttended'
            }
          }
        }
      },
      // remove members that havent attended opportunities within the timeframe
      {
        $match: {
          opportunitiesAttended: {
            $exists: true,
            $not: {
              $size: 0
            }
          }
        }
      }
    ])

    const totalVolunteers = membersWithAttendedInterests.length

    // TODO: send totalVolunteerHours once opportunity.duration is stable/parseable

    res.send({
      totalVolunteers
    })
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = {
  getSummary
}
