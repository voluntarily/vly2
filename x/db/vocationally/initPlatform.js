const { connectDB, disconnectDB, asyncForEach } = require('./util')
const { makeActs } = require('./makeActs')
const { makeClassificationOrgs } = require('./makeOrgs')
const { clearCollections } = require('./clearCollections')
const { OrganisationRole } = require('../../../server/api/organisation/organisation.constants')

// These represent organisations with role: OrganisationRole.ACTIVITY_PROVIDER
const jobs = {
  'Building and Construction' : {
    'Builder': "Bob's Builders"
  },
  'Government and Legal' : {
    'Policy Analyst': "New Zealand Government"
  },
  'Transport and Logistics' : {
    'Truck Driver': "Speedy Logistics"
  },
  'Health Services': {
    'Nurse': "Pacific Medical",
    'Doctor': "Bay Health"
  },
  'Food and Beverage Production': {
    'Baker': "The Bread Brothers",
    'Food Production Assistant': "Snack Squad",
    'Orchard Picker': "Forever Fruity"
  },
  'Consumer Goods': {
    'Online Order Manager': "Homely",
    'Supermarket Shelf Stacker': "Best Foods"
  },
  'Accommodation': {
    'Bookings Manager': "Essential Spaces",
    'Motel Room Cleaner': 'Cosy Corner'
  },
  'Safety and Security': {
    'Security Guard': "Savers Bank"
  },
  'Justice System': {
    'Lawyer': "Hamlin, Hamlin & McGill"
  },
  'Social Services': {
    'Counsellor': 'Helping Hands'
  },
  'Education': {
    'Online Tutor': "LearnIt"
  },
  'Finance' : {
    'Tax Analyst': "Big Bucks"
  },
  'Science' : {
    'Pharmaceutical Assistant': 'Pharmers'
  },
  'Utilities' : {
    'Electrical Technician': "Buzzcut",
    'Power line Surveyor': "PowerUp"
  },
};

// const companies = [
//   { name: '' }
// ]


const clearOps = async () => {
  await Promise.all(
    collections.map(coll => coll.deleteMany())
  )
}

async function main () {
  connectDB()

  // First clear the current contents of the database.
  await clearCollections();

  // TODO: Clear ops

  const params = {
    orgs: [
      { role: OrganisationRole.VOLUNTEER_PROVIDER, count: 10, members: 8, followers: 8 }, // 160 people
      { role: OrganisationRole.OPPORTUNITY_PROVIDER, count: 10, members: 8, followers: 8 }, // 160 people
      { role: OrganisationRole.ACTIVITY_PROVIDER, count: 2, members: 4, followers: 4 } // 16 people
    ],
    acts: { count: 4, ops: 5, interested: 6 } // 120 interest records
  }

  try {
    // await asyncForEach(params.orgs, async org => {
    //   const o = await makeOrgs(org.role, org.count, org.members, org.followers)
    //   console.log('made', o.length, org.role, 'orgs')
    // });

    const o = await makeClassificationOrgs(Object.keys(jobs));
    console.log('made', o.length, ' orgs');
  } catch (e) {
    console.error('Error making orgs:', e)
  }
  try {
    // const act = params.acts
    // const acts = await makeActs(act.count, act.ops, act.interested)
    const acts = await makeActs(jobs);
    console.log(acts.length, 'Acts Created')
  } catch (e) {
    console.error('Error making acts:', e)
  }

  disconnectDB()
  process.exit(0)
}

main()
