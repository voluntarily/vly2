const { InterestArchive } = require('../interest/interest')
const Member = require('../member/member')
const mongoose = require('mongoose')

const getSummary = async (req, res) => {
  const { orgId } = req.params
  // TODO: use timeframe in query

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
      // find members that have at least one attended archived interest
      {
        $match: {
          archivedInterests: {
            $elemMatch: {
              status: 'attended'
            }
          }
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
