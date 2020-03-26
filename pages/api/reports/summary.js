const Person = require('../../../server/api/person/person')
const Activity = require('../../../server/api/activity/activity')
const { Interest } = require('../../../server/api/interest/interest')
const Opportunity = require('../../../server/api/opportunity/opportunity')

const { OpportunityType, OpportunityStatus } = require('../../../server/api/opportunity/opportunity.constants')
const { ActivityStatus } = require('../../../server/api/activity/activity.constants')

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  if (!req.ability.can('manage', 'Person')) { // Not an admin
    return res.status(401).json('Authorisation required')
  }

  const operations = [
    Opportunity.countDocuments({ status: OpportunityStatus.ACTIVE, type: OpportunityType.ASK }).exec(),
    Opportunity.countDocuments({ status: OpportunityStatus.ACTIVE, type: OpportunityType.OFFER }).exec(),
    Person.countDocuments({ }).exec(),
    Interest.countDocuments({ }).exec(),
    Activity.countDocuments({ status: ActivityStatus.ACTIVE }).exec()
  ]

  return Promise.all(operations).then(
    ([askCount, offerCount, personCount, interestCount, activityCount]) =>
      res.send({
        Person: personCount,
        Opportunity: { [OpportunityType.ASK]: askCount, [OpportunityType.OFFER]: offerCount },
        Interest: interestCount,
        Activity: activityCount
      })
  )
}
