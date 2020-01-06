const Member = require('./member')
const PubSub = require('pubsub-js')
const { TOPIC_MEMBER__UPDATE } = require('../../services/pubsub/topic.constants')
const { MemberStatus } = require('./member.constants')

/* get a single member record with org and person populated out */
const getMemberbyId = id => {
  return Member.findOne({ _id: id })
    .populate({ path: 'person', select: 'nickname name imgUrl email' })
    .populate({ path: 'organisation', select: 'name imgUrl category' })
    .exec()
}

// creates a new member or updates status of existing member
const addMember = async (member) => {
  const found = await Member.findOneAndUpdate(
    { // check for a match
      person: member.person,
      organisation: member.organisation
    },
    member, // create or upsert
    { new: true, upsert: true }
  )
  if (found) {
    PubSub.publish(TOPIC_MEMBER__UPDATE, found)
  }
  // get populated out member record
  const got = await getMemberbyId(found._id)
  return got
}

function compareMemberStatus (a, b) {
  if (a.status === b.status) return 0
  if (a.status === MemberStatus.ORGADMIN) return -1
  if (b.status === MemberStatus.ORGADMIN) return 1
  if (a.status === MemberStatus.MEMBER) return -1
  if (b.status === MemberStatus.MEMBER) return 1
  if (a.status === MemberStatus.FOLLOWER) return -1
  if (b.status === MemberStatus.FOLLOWER) return 1

  // all others return arbitary a
  return -1
}

const findOrgByPersonIdAndCategory = async (personId, category) => {
  // search membership table for org matching category and person id
  const query = { person: personId }
  let myorgs = await Member.find(query).populate({ path: 'organisation', select: 'name category' }).exec()

  // filter by category if present  e.g /my/org/vp
  if (category) {
    myorgs = myorgs.filter(
      o => o.organisation.category.includes(category))
  }
  if (!myorgs.length) { // failed to find matching org
    return null
  }
  // sort to give most important level of membership first.
  myorgs.sort(compareMemberStatus)
  // get id of Organisation
  return myorgs[0].organisation._id
}

module.exports = {
  getMemberbyId,
  addMember,
  findOrgByPersonIdAndCategory
}
