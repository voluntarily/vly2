const { getSentences, gra, asyncForEach } = require('./util')
const Organisation = require('../../../server/api/organisation/organisation')
const Member = require('../../../server/api/member/member')
const { MemberStatus } = require('../../../server/api/member/member.constants')
const { makePeople } = require('./makePeople')
const { OrganisationRole } = require('../../../server/api/organisation/organisation.constants')

const makeOrgMembers = async (org, memberStatus, memberCount) => {
  try {
    const people = await makePeople(memberCount)
    const members = people.map((person, index) => {
      return ({
        person: person._id,
        organisation: org._id,
        validation: `${person.email} belongs to ${org.name}`,
        status: memberStatus
      })
    })
    // console.log('Members:', members.length)
    return Member.create(members)
  } catch (e) {
    console.error('Error making org members', e)
  }
}

/**
 * create a new organisation, make the person the orgAdmin
 * make the members list members
 * @param {*} role - type of org
 * @param {*} person  - person to make org admin
 * @param {*} memberCount - number of people to add as members
 */

const makeOrg = async (role, members, followers) => {
  const people = await makePeople(1)
  const owner = people[0]
  const code = gra(10000, 99909)
  const about = getSentences()
  const org = {
    name: `${owner.nickname} ${code} ${role}`,
    slug: `${owner.nickname}-${code}-${role}`,
    imgUrl: `https://picsum.photos/seed/${owner.nickname}/200/200`,
    website: `https://${owner.nickname}.co.nz`,
    role,
    info: {
      about,
      instructions: 'Getting started instructions',
      followers: 'Message for followers',
      joiners: 'Message for joiners',
      members: 'Message for members'
    }
  }

  if (owner) {
    org.contactName = owner.name
    org.contactEmail = owner.email
    org.contactPhoneNumber = owner.phone
  }
  org.address = '49 Random Street, Auckland, 1010'

  if (role === OrganisationRole.OPPORTUNITY_PROVIDER) { // a school
    const from = gra(5, 15)
    const to = gra(from, 25)
    org.ageRange = { from, to }
    org.decile = gra(1, 10)
  }
  try {
    const saved = await Organisation.create(org)
    await makeOrgMembers(saved, MemberStatus.ORGADMIN, 1)
    const m = await makeOrgMembers(saved, MemberStatus.MEMBER, members)
    const f = await makeOrgMembers(saved, MemberStatus.FOLLOWER, followers)
    console.log('org:', saved.name, m.length, ' members', f.length, 'followers')
  } catch (e) {
    console.error('Error creating org', e)
  }

  return org
}

const makeOrgs = async (role, count, members, followers) => {
  const orgs = Array(count).fill({})
  try {
    await asyncForEach(orgs, async org => {
      org = await makeOrg(role, members, followers)
    })
  } catch (e) {
    console.error('Error making orgs:', e)
  }
  return orgs
}

module.exports = {
  makeOrg,
  makeOrgs
}
