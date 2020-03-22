const Person = require('../../../server/api/person/person')
const Organisation = require('../../../server/api/organisation/organisation')
const Member = require('../../../server/api/member/member')
const { Interest, InterestArchive } = require('../../../server/api/interest/interest')
const Activity = require('../../../server/api/activity/activity')
const Opportunity = require('../../../server/api/opportunity/opportunity')
const ArchivedOpportunity = require('../../../server/api/archivedOpportunity/archivedOpportunity')
const Story = require('../../../server/api/story/story')
const Tag = require('../../../server/api/tag/tag')

const collections = [Person, Organisation, Activity, Interest, InterestArchive, Member, Opportunity, ArchivedOpportunity, Story, Tag]
const clearCollections = async () => {
  await Promise.all(
    collections.map(coll => coll.deleteMany())
  )
}
module.exports = {
  clearCollections
}
