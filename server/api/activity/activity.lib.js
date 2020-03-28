const Activity = require('./activity')
const Opportunity = require('../opportunity/opportunity')
const { OpportunityType } = require('../opportunity/opportunity.constants')

const findActivity = async (req, res) => {
  // filter by role if present  e.g /my/org/vp
  const slug = req.params.slug
  // get id of Activity
  try {
    const act = await Activity.findOne({ slug }, 'name').exec()
    res.redirect(307, `/acts/${act._id}`)
  } catch (e) {
    return res.status(404).send('No matching activity')
  }
}

/**
  * populate an activity with the number of active asks and offers
  * @param {*} actid - activity id
  */
const getOpsForActivity = async (actid) => {
  const counts = {
    [OpportunityType.ASK]: await Opportunity.countDocuments({ fromActivity: actid, type: OpportunityType.ASK }),
    [OpportunityType.OFFER]: await Opportunity.countDocuments({ fromActivity: actid, type: OpportunityType.OFFER })
  }
  return counts
}

module.exports = {
  findActivity,
  getOpsForActivity
}
