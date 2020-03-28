import { Role } from '../../../server/services/authorize/role'
const Person = require('../../../server/api/person/person')
const Organisation = require('../../../server/api/organisation/organisation')
const Activity = require('../../../server/api/activity/activity')
const Member = require('../../../server/api/member/member')

const { Interest } = require('../../../server/api/interest/interest')
const Opportunity = require('../../../server/api/opportunity/opportunity')

const { OpportunityStatus } = require('../../../server/api/opportunity/opportunity.constants')
const { ActivityStatus } = require('../../../server/api/activity/activity.constants')

const reduceKeyValues = aggregation => aggregation.reduce((acc, kv) =>
  Object.assign(acc, { [kv.key]: kv.value }), {})

// Single group values (e.g. status) return a string
// Multiple group values (e.g. role) return an array
const aggregateProjection = { $project: { _id: false, key: '$_id', value: '$total' } }

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  if (!(req.session.me && req.session.me.role.includes(Role.ADMIN))) { // Not an admin
    return res.status(401).json('Authorisation required')
  }

  const operations = [
    // Basic counts
    Activity.countDocuments({ status: ActivityStatus.ACTIVE }).exec(),
    Interest.countDocuments({}).exec(),
    Member.countDocuments({}).exec(),
    Opportunity.countDocuments({ }),
    Organisation.countDocuments({ }),
    Person.countDocuments({ }).exec(),

    // Grouping by an enumerable - e.g. status or role
    Interest.aggregate([
      { $group: { _id: '$status', total: { $sum: 1 } } },
      aggregateProjection]).exec(),
    Member.aggregate([
      { $group: { _id: '$status', total: { $sum: 1 } } },
      aggregateProjection]).exec(),
    Opportunity.aggregate([
      { $match: { status: OpportunityStatus.active } },
      aggregateProjection]).exec(),
    Organisation.aggregate([
      { $group: { _id: '$role', total: { $sum: 1 } } },
      aggregateProjection]).exec()
  ]

  return Promise.all(operations).then(
    ([activityCount, interestCount, memberCount, opportunityCount, organisationCount, personCount,
      interestsByStatus, membersByStatus, opportunitiesByType, organisationsByRole]) =>
      res.send({
        Person: { total: personCount },
        Opportunity: { total: opportunityCount, type: reduceKeyValues(opportunitiesByType) },
        Organisation: { total: organisationCount, role: reduceKeyValues(organisationsByRole) },
        Interest: { total: interestCount, status: reduceKeyValues(interestsByStatus) },
        Member: { total: memberCount, status: reduceKeyValues(membersByStatus) },
        Activity: { total: activityCount }
      })
  )
}
