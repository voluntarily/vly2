const { getLocation } = require('./location');
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

const makeOp = async (interestCount, fromActivity, companyName, location, positionsAtLocation) => {
  console.log('makeOp', interestCount, fromActivity.name, companyName, location, positionsAtLocation)

  // find a random op
  const orgs = await Organisation.find({ role: OrganisationRole.OPPORTUNITY_PROVIDER, name: companyName })
  console.log('company to make op for: ', companyName);

  // const location = getLocation(companyName);

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

  // console.log('fromActivity', fromActivity);
  console.log();
  const op = fromActivity
    ? {
      type: OpportunityType.ASK,
      name: `${fromActivity.name} in ${location}`,
      imgUrl: fromActivity.imgUrl,
      subtitle: `${positionsAtLocation === 1 ? `1 position` : `${positionsAtLocation} positions`} available`,
      description: `${positionsAtLocation === 1 ? `1 position` : `${positionsAtLocation} positions`} available`,
      duration: fromActivity.duration,
      location,
      venue: 'Venue Address',
      status: OpportunityStatus.ACTIVE,
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
  // const interesteds = await makeInterestedVolunteers(saved, InterestStatus.INTERESTED, split)
  // const inviteds = await makeInterestedVolunteers(saved, InterestStatus.INVITED, split)
  // const committeds = await makeInterestedVolunteers(saved, InterestStatus.COMMITTED, split)
  // console.log('op:', saved.name, interesteds.length + inviteds.length + committeds.length)
  return saved
}

const splitInt = async (number) => {
  let n = number;
  let a = [];
  while (n > 0) {
    let s = Math.round(Math.random() * (n - 1)) + 1;;
    a.push(s);
    n -= s;
  }
  return a;
}

const makeOps = async (count, interestCount, fromActivity, companyName) => {
  const positionsAvailable = fromActivity.volunteers;
  const positionsPerLocation = positionsAvailable > 1 ? await splitInt(positionsAvailable) : [1];
  const numberOfLocations = positionsPerLocation.length;
  let locations = [];
  for (let i = 0; i < numberOfLocations; i += 1) {
    locations.push(getLocation(companyName));
  }

  console.log('===');
  console.log('positionsAvailable', positionsAvailable);
  console.log('positionsPerLocation', positionsPerLocation);
  console.log('numberOfLocations', numberOfLocations);
  // console.log('makeOps', positionsAvailable, interestCount, fromActivity.name, companyName);
  return Promise.all(
    Array(numberOfLocations).fill({}).map((_, index) => makeOp(interestCount, fromActivity, companyName, locations[index], positionsPerLocation[index]))
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
