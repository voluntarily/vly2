const { getSentences, coin, gra, getTags, asyncForEach } = require('./util')
const Organisation = require('../../../server/api/organisation/organisation')
const { OrganisationRole } = require('../../../server/api/organisation/organisation.constants')
const Member = require('../../../server/api/member/member')
const Activity = require('../../../server/api/activity/activity')
const { MemberStatus } = require('../../../server/api/member/member.constants')
const { ActivityStatus } = require('../../../server/api/activity/activity.constants')
const slug = require('limax')
const { makeOps } = require('./makeOps')
/**
 * create a new activity, make the person the owner
 * opCount - number of derived opportunities to create
 */

const makeAct = async (ops, interested) => {
  // find a random op
  console.log('makeAct', ops, interested)
  const orgs = await Organisation.find({ role: OrganisationRole.ACTIVITY_PROVIDER })
  const org = orgs[gra(0, orgs.length - 1)]
  // find a member of ap
  const members = await Member
    .find({ organisation: org._id, status: MemberStatus.MEMBER })
    .populate('person', 'name nickname')
  const owner = members[gra(0, members.length - 1)].person
  const fact = getSentences()
  const code = gra(10000, 99909)
  const name = `${owner.nickname} ${code} Activity`
  const tags = getTags(gra(2, 10))
  const act = {
    name,
    slug: slug(name),
    imgUrl: `https://picsum.photos/seed/${slug(name)}/200/200`,
    subtitle: `${owner.nickname} ${code}`,
    description: fact,
    duration: '8 hours',
    location: 'Northland',
    venue: 'Venue Address',
    offerOrg: org._id,
    owner: owner._id,
    volunteers: gra(1, 50),
    tags,
    status: coin(ActivityStatus.DRAFT, ActivityStatus.ACTIVE)
  }

  const saved = await Activity.create(act)

  console.log('act', act);
  console.log('saved', saved);

  // now make some ops based on activity
  const o = await makeOps(ops, interested, act)
  console.log('act:', saved.name, ' with associated ops:', o.length)
  return act
}

// very parallel version
// const makeActs = async (count, ops, interested) => {
//   console.log('making Activities', count, ops, interested)
//   return Promise.all(
//     Array(count).fill({}).map(() => makeAct(ops, interested))
//   )
// }

// serialised version
const makeActs = async (count, ops, interested) => {
  console.log('making Activities', count, ops, interested)
  const acts = Array(count).fill({})
  try {
    await asyncForEach(acts, async act => {
      act = await makeAct(ops, interested)
    })
  } catch (e) {
    console.error('Error making acts:', e)
  }
  return acts
}
module.exports = {
  makeAct,
  makeActs
}
