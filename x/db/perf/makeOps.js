const { getSentences, coin, gra, getTags } = require('./util')
const Organisation = require('../../../server/api/organisation/organisation')
const { OrganisationRole } = require('../../../server/api/organisation/organisation.constants')
const Member = require('../../../server/api/member/member')
const Opportunity = require('../../../server/api/opportunity/opportunity')
const { Interest } = require('../../../server/api/interest/interest')
const { MemberStatus } = require('../../../server/api/member/member.constants')
const { InterestStatus } = require('../../../server/api/interest/interest.constants')
const { OpportunityStatus, OpportunityType } = require('../../../server/api/opportunity/opportunity.constants')
const moment = require('moment')

const makeMessages = (numMessages, a, b, status, op) =>
  Array(numMessages).fill({}).map((item, index) => ({
    body: coin(`Example message ${a.name} is ${status} in ${op.name}`, 'Thanks for the feedback, I will be in touch'),
    author: coin(a, b),
    createdAt: moment().subtract(gra(5, 1200), 'minutes').format()
  }))

const makeInterestedVolunteer = (op, personId, status) => {
  // pick a vp organisation, then pick a random member.
  return {
    person: personId,
    opportunity: op,
    messages: makeMessages(gra(2, 4), personId, op.requestor._id, status, op),
    status
  }
}

const makeInterestedVolunteers = async (op, interestStatus, interestCount) => {
  console.log('makeInterestedVolunteers', op.name, interestStatus, interestCount)

  const orgs = await Organisation.find({ role: OrganisationRole.VOLUNTEER_PROVIDER })
  const org = orgs[gra(0, orgs.length - 1)]
  const vps = await Member.find({ organisation: org._id, status: MemberStatus.MEMBER })
  const interests = (Array(interestCount).fill({}).map(() => {
    const personId = vps[gra(0, vps.length - 1)].person
    return makeInterestedVolunteer(op, personId, interestStatus)
  }))
  // console.log('creating ', interests.length, ' interests')
  return Interest.create(interests)
}

/**
 * create a new opportunity, make the person the requestor
 * make the members list members
 * @param {*} interestCount - number of people to add as interested
 */

const makeOp = async (interestCount, fromActivity) => {
  console.log('makeOp', interestCount, fromActivity.name)

  // find a random op
  const orgs = await Organisation.find({ role: OrganisationRole.OPPORTUNITY_PROVIDER })
  const org = orgs[gra(0, orgs.length - 1)]
  // find a member of op
  const members = await Member
    .find({ organisation: org._id, status: MemberStatus.MEMBER })
    .populate('person', 'name nickname')
  const requestor = members[gra(0, members.length - 1)].person
  const fact = getSentences()
  const code = gra(10000, 99909)
  const tags = getTags(gra(2, 10))
  const startDate = moment().add(gra(2, 60), 'days')
  const endDate = startDate.add(gra(0, 4), 'days')
  const date = coin([startDate.format()], [startDate.format(), endDate.format()])

  const op = fromActivity
    ? {
      type: OpportunityType.ASK,
      name: `${fromActivity.name} Opportunity`,
      imgUrl: fromActivity.imgUrl,
      subtitle: fromActivity.subtitle,
      description: fromActivity.description,
      duration: fromActivity.duration,
      location: 'Northland',
      venue: 'Venue Address',
      status: coin(OpportunityStatus.DRAFT, OpportunityStatus.ACTIVE),
      date,
      fromActivity: fromActivity._id,
      offerOrg: org._id,
      requestor: requestor._id,
      tags
    }
    : {
      type: OpportunityType.ASK,
      name: `${requestor.nickname} ${code} Opportunity`,
      imgUrl: `https://picsum.photos/seed/${requestor.nickname}-${code}/200/200`,
      subtitle: `${requestor.nickname} ${code}`,
      description: fact,
      duration: '8 hours',
      location: 'Northland',
      venue: 'Venue Address',
      status: coin(OpportunityStatus.DRAFT, OpportunityStatus.ACTIVE),
      // date: ,
      // fromActivity,
      offerOrg: org._id,
      requestor: requestor._id,
      tags
    }
  const saved = await Opportunity.create(op)
  const split = Math.round(interestCount / 3)
  const interesteds = await makeInterestedVolunteers(saved, InterestStatus.INTERESTED, split)
  const inviteds = await makeInterestedVolunteers(saved, InterestStatus.INVITED, split)
  const committeds = await makeInterestedVolunteers(saved, InterestStatus.COMMITTED, split)
  return saved
}

const makeOps = async (count, interestCount, fromActivity) => {
  console.log('makeOps', count, interestCount, fromActivity.name)
  return Promise.all(
    Array(count).fill({}).map(() => makeOp(interestCount, fromActivity))
  )
}

module.exports = {
  makeOp,
  makeOps
}
// async function main () {
//   connectDB()

//   // if (!process.argv[2]) {
//   //   console.log('Usage: makeOps count interestCount')
//   //   process.exit(1)
//   // }
//   const count = Number(process.argv[2]) || 5
//   const interestCount = Number(process.argv[3]) || 5
//   const ops = await makeOps(count, interestCount)
//   disconnectDB()
//   console.log(ops.length, 'Ops Created')
//   process.exit(0)
// }

// main()
