const { getSentences, gra } = require('./util')
const Organisation = require('../../../server/api/organisation/organisation')
const Member = require('../../../server/api/member/member')
const { MemberStatus } = require('../../../server/api/member/member.constants')
const { makePeople } = require('./makePeople')

const makeOrgMembers = async (org, memberStatus, memberCount) => {
  const people = await makePeople(memberCount)
  const members = people.map((person, index) => {
    return ({
      person: person._id,
      organisation: org._id,
      validation: `${person.email} belongs to ${org.name}`,
      status: memberStatus
    })
  })
  return Member.create(members)
}

/**
 * create a new organisation, make the person the orgAdmin
 * make the members list members
 * @param {*} category - type of org
 * @param {*} person  - person to make org admin
 * @param {*} memberCount - number of people to add as members
 */

const makeOrg = async (category, members, followers) => {
  const people = await makePeople(1)
  const owner = people[0]
  const code = gra(10000, 99909)
  const about = getSentences()
  const org = {
    name: `${owner.nickname} ${code} ${category}`,
    slug: `${owner.nickname}-${code}-${category}`,
    imgUrl: `https://picsum.photos/seed/${owner.nickname}/200/200`,
    website: `https://${owner.nickname}.co.nz`,
    category,
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

  if (category === 'op') { // a school
    const from = gra(5, 15)
    const to = gra(from, 25)
    org.ageRange = { from, to }
    org.decile = gra(1, 10)
  }
  const saved = await Organisation.create(org)
  await makeOrgMembers(saved, MemberStatus.ORGADMIN, 1)
  const m = await makeOrgMembers(saved, MemberStatus.MEMBER, members)
  const f = await makeOrgMembers(saved, MemberStatus.FOLLOWER, followers)
  console.log('org:', saved.name, m.length, ' members', f.length, 'followers')
  return org
}

const makeOrgs = async (category, count, members, followers) => {
  return Promise.all(
    Array(count).fill({}).map(() => makeOrg(category, members, followers))
  )
}

module.exports = {
  makeOrg,
  makeOrgs
}
