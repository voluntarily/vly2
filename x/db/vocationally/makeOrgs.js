const faker = require('../../../node_modules/faker');

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

const makeClassificationOrg = async (role, members, followers, label) => {
  console.log(`================================================ ${label}`);
  const people = await makePeople(1)
  const owner = people[0]
  const code = gra(10000, 99909)
  const about = getSentences()

  const classificationSlug = label.toLowerCase().replace(/-/g, "").replace(/,/g, "").replace(/  /g, "").replace(/ /g, "-");

  const org = {
    name: `${label}`,
    slug: classificationSlug,
    imgUrl: `https://picsum.photos/seed/${classificationSlug}/200/200`,
    website: `https://${classificationSlug}.co.nz`,
    role: OrganisationRole.ACTIVITY_PROVIDER,
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

const makeCompanyOrg = async (role, members, followers, companyName) => {
  console.log(`================================================ ${companyName}`);
  const people = await makePeople(1)
  const owner = people[0]
  const code = gra(10000, 99909)
  const about = getSentences()

  const companySlug = companyName.toLowerCase().replace(/-/g, "").replace(/,/g, "").replace(/  /g, "").replace(/ /g, "-");

  const org = {
    name: `${companyName}`,
    slug: companySlug,
    imgUrl: `https://picsum.photos/seed/${companySlug}/200/200`,
    website: `https://${companySlug}.co.nz`,
    role: OrganisationRole.OPPORTUNITY_PROVIDER,
    info: {
      about,
      instructions: 'Getting started instructions',
      followers: 'Message for followers',
      joiners: 'Message for joiners',
      members: 'Message for members'
    }
  }

  // console.log('org', org);

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

const makeClassificationOrgs = async (classifications) => {
  // ACTIVITY PROVIDERS
  const classificationOrgs = Array(classifications.length).fill({});
  try {
    await asyncForEach(classificationOrgs, async (classification, index) => {
      classification = await makeClassificationOrg(OrganisationRole.ACTIVITY_PROVIDER, 10, 10, classifications[index])
    })
  } catch (e) {
    console.error('Error making orgs:', e)
  }

  const orgs = [...classificationOrgs];
  return orgs;
}

// const makeCompanyOrgs = async () => {
//   // OPPORTUNITY PROVIDERS
//   const companyOrgs = Array(classifications.length).fill({});
//   try {
//     await asyncForEach(classificationOrgs, async (classification, index) => {
//       company = await makeCompanyOrg(OrganisationRole.OPPORTUNITY_PROVIDER, 10, 10)
//     })
//   } catch (e) {
//     console.error('Error making orgs:', e)
//   }

//   const orgs = [...companyOrgs];
//   return orgs;
// }

module.exports = {
  makeClassificationOrgs,
  makeCompanyOrg,
}
