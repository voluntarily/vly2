const { InterestArchive } = require('../interest/interest')
const Member = require('../member/member')
const mongoose = require('mongoose')
const moment = require('moment')

const getMembersWithAttendedInterests = async (orgId, afterDate) =>
  Member.aggregate([
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

const parseStatisticsTimeframe = timeframe => {
  switch (timeframe) {
    case 'month':
      return moment().subtract(1, 'months').toDate()
    case 'year':
      return moment().subtract(1, 'years').toDate()
    default:
      throw Error('invalid timeframe: must be month/year')
  }
}

module.exports = {
  getMembersWithAttendedInterests,
  parseStatisticsTimeframe
}
