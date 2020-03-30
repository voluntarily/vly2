const { connectDB, disconnectDB, asyncForEach } = require('./util')
const { makeActs } = require('./makeActs')
const { makeOrgs } = require('./makeOrgs')
const { clearCollections } = require('./clearCollections')
const { OrganisationRole } = require('../../../server/api/organisation/organisation.constants')

/**
 * This table provides counts for each type of entity created - orgs, members, activities, opportunities and interests
 * the numbers scale up fairly quickly.
 * Time to create on localhost (Andrew's Macbook)
 * scale,   time,   orgs,  people, opportunities, interests
 *    xs,   3.568,     11,      74,        4, 8
 *     s,   3.692,     22,     336,       20, 120
 *     m,  17.263,     44,    2864,      100, 1200
 *     l, 435.180,    110,   38100,     1000, 12000
 *    xl,       ,    450,  250000,      2000, 24000
 *   xxl,       ,   6100, 2110000,      4000, 48000
 */
const scale = {
  xs: {
    orgs: [
      { role: OrganisationRole.VOLUNTEER_PROVIDER, count: 5, members: 5, followers: 2 }, // 35 people
      { role: OrganisationRole.OPPORTUNITY_PROVIDER, count: 5, members: 5, followers: 2 }, // 35 people
      { role: OrganisationRole.ACTIVITY_PROVIDER, count: 1, members: 2, followers: 2 } // 4 people
    ],
    acts: { count: 2, ops: 2, interested: 2 } // 8 interest records
  },
  s: {
    orgs: [
      { role: OrganisationRole.VOLUNTEER_PROVIDER, count: 10, members: 8, followers: 8 }, // 160 people
      { role: OrganisationRole.OPPORTUNITY_PROVIDER, count: 10, members: 8, followers: 8 }, // 160 people
      { role: OrganisationRole.ACTIVITY_PROVIDER, count: 2, members: 4, followers: 4 } // 16 people
    ],
    acts: { count: 4, ops: 5, interested: 6 } // 120 interest records
  },
  m: {
    orgs: [
      { role: OrganisationRole.VOLUNTEER_PROVIDER, count: 20, members: 50, followers: 50 }, // 2000 people
      { role: OrganisationRole.OPPORTUNITY_PROVIDER, count: 20, members: 20, followers: 20 }, // 800 people
      { role: OrganisationRole.ACTIVITY_PROVIDER, count: 4, members: 8, followers: 8 } // 64 people
    ],
    acts: { count: 10, ops: 10, interested: 12 } // 1200 interest records
  },
  l: {
    orgs: [
      { role: OrganisationRole.VOLUNTEER_PROVIDER, count: 50, members: 200, followers: 100 }, // 15,000 people
      { role: OrganisationRole.OPPORTUNITY_PROVIDER, count: 50, members: 20, followers: 100 }, // 6000 people
      { role: OrganisationRole.ACTIVITY_PROVIDER, count: 10, members: 10, followers: 200 } // 2100 people
    ],
    acts: { count: 50, ops: 20, interested: 12 } // 12,000 interested
  },
  xl: {
    orgs: [
      { role: OrganisationRole.VOLUNTEER_PROVIDER, count: 200, members: 800, followers: 200 }, // 200,000
      { role: OrganisationRole.OPPORTUNITY_PROVIDER, count: 200, members: 20, followers: 200 }, // 44,000
      { role: OrganisationRole.ACTIVITY_PROVIDER, count: 50, members: 20, followers: 100 } // 6,000
    ],
    acts: { count: 100, ops: 20, interested: 12 } // 24,000 interested
  },
  xxl: {
    orgs: [
      { role: OrganisationRole.VOLUNTEER_PROVIDER, count: 1000, members: 800, followers: 200 }, // 1,000,000
      { role: OrganisationRole.OPPORTUNITY_PROVIDER, count: 5000, members: 20, followers: 200 }, // 1,100,000
      { role: OrganisationRole.ACTIVITY_PROVIDER, count: 100, members: 20, followers: 100 } // 12,000
    ],
    acts: { count: 200, ops: 20, interested: 12 } // 48,000 interested
  }
}

async function main () {
  connectDB()

  if (!process.argv[2]) {
    console.log('Usage: initPlatform [xs|s|m|l|xl] --keep')
    console.log('--keep will not clear the existing database, creating more new values')
    process.exit(1)
  }
  const size = process.argv[2] || 'xs'
  if (!(process.argv[3] && process.argv[3] === '--keep')) {
    await clearCollections()
  }
  const params = scale[size]
  try {
    await asyncForEach(params.orgs, async org => {
      const o = await makeOrgs(org.role, org.count, org.members, org.followers)
      console.log('made', o.length, org.role, 'orgs')
    })
  } catch (e) {
    console.error('Error making orgs:', e)
  }
  try {
    const act = params.acts
    const acts = await makeActs(act.count, act.ops, act.interested)
    console.log(acts.length, 'Acts Created')
  } catch (e) {
    console.error('Error making acts:', e)
  }

  disconnectDB()
  process.exit(0)
}

main()
