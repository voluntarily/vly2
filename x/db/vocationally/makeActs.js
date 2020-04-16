const { getSentences, coin, gra, getTags, asyncForEach } = require('./util')
const Organisation = require('../../../server/api/organisation/organisation')
const { OrganisationRole } = require('../../../server/api/organisation/organisation.constants')
const Member = require('../../../server/api/member/member')
const Activity = require('../../../server/api/activity/activity')
const { MemberStatus } = require('../../../server/api/member/member.constants')
const { ActivityStatus } = require('../../../server/api/activity/activity.constants')
const slug = require('limax')
const { makeOps } = require('./makeOps')
const { makeCompanyOrg } = require('./makeOrgs')
/**
 * create a new activity, make the person the owner
 * opCount - number of derived opportunities to create
 */

// const availableCompanyNames = {
//   'Building and Construction':    ["Bob's Builders", "Hammer Time", ""]
//   'Government and Legal':          `${basePath}government-and-legal.jpeg`,
//   'Transport and Logistics': `${basePath}transport-and-logistics.jpeg`,
//   'Health Services': `${basePath}health.jpeg`,
//   'Food and Beverage Production': `${basePath}food-and-beverage-production.jpeg`,
//   'Consumer Goods': `${basePath}consumer-goods.jpeg`,
//   'Accommodation': `${basePath}accommodation.jpeg`,
//   'Safety and Security': `${basePath}safety-and-security.jpeg`,
//   'Justice System': `${basePath}justice-system.jpeg`,
//   'Social Services': `${basePath}social-services.jpeg`,
//   'Education': `${basePath}education.jpeg`,
//   'Finance': `${basePath}finance.jpeg`,
//   'Science': `${basePath}science.jpeg`,
//   'Utilities': `${basePath}utilities.jpeg`,
// };

 // A mapping between classifications and image paths.
const basePath = '/static/img/vocationally/classifications/';
const images = {
  'Building and Construction':    `${basePath}building-and-construction.jpeg`,
  'Government and Legal':         `${basePath}government-and-legal.jpeg`,
  'Transport and Logistics':      `${basePath}transport-and-logistics.jpeg`,
  'Health Services':              `${basePath}health.jpeg`,
  'Food and Beverage Production': `${basePath}food-and-beverage-production.jpeg`,
  'Consumer Goods':               `${basePath}consumer-goods.jpeg`,
  'Accommodation':                `${basePath}accommodation.jpeg`,
  'Safety and Security':          `${basePath}safety-and-security.jpeg`,
  'Justice System':               `${basePath}justice-system.jpeg`,
  'Social Services':              `${basePath}social-services.jpeg`,
  'Education':                    `${basePath}education.jpeg`,
  'Finance':                      `${basePath}finance.jpeg`,
  'Science':                      `${basePath}science.jpeg`,
  'Utilities':                    `${basePath}utilities.jpeg`,
};

const makeAct = async (jobTitle, companyName, classification, ops, interested) => {


  await makeCompanyOrg(OrganisationRole.ACTIVITY_PROVIDER, 10, 10, companyName);


  // find a random op
  console.log('makeAct', ops, interested)
  const orgs = await Organisation.find({ role: OrganisationRole.ACTIVITY_PROVIDER, name: classification })
  const org = orgs[gra(0, orgs.length - 1)]
  // find a member of ap
  // TODO: Find Organsiation Member
  const members = await Member
    .find({ organisation: org._id, status: MemberStatus.MEMBER })
    .populate('person', 'name nickname');
  console.log('members:', members);

  const owner = members[gra(0, members.length - 1)].person
  const fact = getSentences()
  const code = gra(10000, 99909)
  const name = jobTitle
  const tags = getTags(gra(2, 10));
  const slug = `${name}-${code}`;
  console.log('slug', slug);

  const act = {
    name,
    slug,
    // imgUrl: `https://picsum.photos/seed/${slug(name)}/200/200`,
    imgUrl: images[classification],
    // subtitle: `${owner.nickname} ${code}`,
    subtitle: `Company: ${companyName}`,
    description: fact,
    duration: `${gra(1, 4)} month`,
    // location: 'Northland',
    // venue: 'Venue Address',
    offerOrg: org._id,
    owner: owner._id,
    volunteers: Math.random() > 0.5 ? gra(2, 50) : 1, // 50/50 chance to be group job vs individual
    tags,
    status: coin(ActivityStatus.DRAFT, ActivityStatus.ACTIVE)
  }

  const saved = await Activity.create(act)

  // now make some ops based on activity
  const o = await makeOps(10, 10, act, companyName) //TODO

  // getLocation = (str) => District.
  // getLocation('asdf') => 'Porirua', 'Palmerston North', .. 


  // console.log('act:', saved.name, ' with associated ops:', o.length)
  return act;
}

// very parallel version
// const makeActs = async (count, ops, interested) => {
//   console.log('making Activities', count, ops, interested)
//   return Promise.all(
//     Array(count).fill({}).map(() => makeAct(ops, interested))
//   )
// }

// serialised version
const makeActs = async (jobs) => {
  // console.log('making Activities', count, ops, interested)
  let acts = [];
  try {
    await asyncForEach(Object.keys(jobs), async classification => {
      const jobTitles = Object.keys(jobs[classification]);
      const numberOfJobs = jobTitles.length;
      const currentActs = Array(numberOfJobs).fill({});
      console.log('numberOfJobs', numberOfJobs);
      if (numberOfJobs > 0) {
        await asyncForEach(currentActs, async (act, index) => {
          const jobTitle = jobTitles[index];
          const companyName = jobs[classification][jobTitle];
          console.log('jobTitle=========================', jobTitle);
          console.log('companyName=========================', companyName);
          act = await makeAct(jobTitle, companyName, classification, 10, 10)
        });
        acts = [...acts, ...currentActs];
      }
    });
  } catch (e) {
    console.error('Error making acts:', e)
  }
  return acts;
}

module.exports = {
  makeAct,
  makeActs
}
