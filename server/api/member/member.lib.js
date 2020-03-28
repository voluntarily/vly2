const Member = require('./member')
const PubSub = require('pubsub-js')
const { TOPIC_MEMBER__UPDATE } = require('../../services/pubsub/topic.constants')
const { MemberStatus } = require('./member.constants')
const { Role } = require('../../services/authorize/role')

/* get a single member record with org and person populated out */
const getMemberbyId = id => {
  return Member.findOne({ _id: id })
    .populate({ path: 'person', select: 'nickname name imgUrl email sendEmailNotifications' })
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
  // get populated out member record
  const got = await getMemberbyId(found._id)
  if (found) {
    PubSub.publish(TOPIC_MEMBER__UPDATE, got)
  }
  return got
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
  const orgAdminOrgs = myorgs.filter((member) => member.status === MemberStatus.ORGADMIN)
  const memberOrgs = myorgs.filter((member) => member.status === MemberStatus.MEMBER)
  const followerOrgs = myorgs.filter((member) => member.status === MemberStatus.FOLLOWER)
  const otherOrgs = myorgs.filter((member) => {
    return [
      MemberStatus.ORGADMIN,
      MemberStatus.MEMBER,
      MemberStatus.FOLLOWER
    ].includes(member.status) === false
  })

  const sortedOrgs = [].concat(orgAdminOrgs, memberOrgs, followerOrgs, otherOrgs)

  // get id of Organisation
  return sortedOrgs[0].organisation._id
}

const orgToRoleTable = {
  admin: Role.ADMIN,
  op: Role.OPPORTUNITY_PROVIDER,
  ap: Role.ACTIVITY_PROVIDER,
  other: Role.RESOURCE_PROVIDER,
  test: Role.TESTER
}
// desired sort order for roles
// ANON, VP, OP,AP, ORG_ADMIN, ADMIN
const sortRoles = roles => {
  const desiredOrder = [
    Role.ANON,
    Role.VOLUNTEER,
    Role.OPPORTUNITY_PROVIDER,
    Role.ACTIVITY_PROVIDER,
    Role.RESOURCE_PROVIDER,
    Role.ORG_ADMIN,
    Role.TESTER,
    Role.ADMIN
  ]
  const sortedRoles = []
  desiredOrder.map(r => {
    if (roles.includes(r)) sortedRoles.push(r)
  })
  return sortedRoles
}

const getPersonRoles = async person => {
  const membershipQuery = { person: person._id }
  const membership = await Member
    .find(membershipQuery)
    .populate({ path: 'organisation', select: 'name category' })
    .lean()
    .exec()
  const role = person.role // role is required and has a defult
  const orgAdminFor = []
  membership.map(m => {
    if (m.status === MemberStatus.ORGADMIN) {
      role.push(Role.ORG_ADMIN)
      orgAdminFor.push(m.organisation._id)
    }
    if ([MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status)) {
      m.organisation.category.map(category => {
        const r = orgToRoleTable[category]
        r && role.push(r)
      })
    }
  })
  person.orgAdminFor = orgAdminFor
  person.role = sortRoles(role)
  return [role, orgAdminFor]
}

module.exports = {
  getMemberbyId,
  addMember,
  findOrgByPersonIdAndCategory,
  getPersonRoles,
  sortRoles
}
