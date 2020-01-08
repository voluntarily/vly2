/* eslint-disable no-undef */
/*
  This list of goals is loaded into the database by calling
  /api/xadmin/loadGoals
*/
import { GoalGroup } from '../goalGroup'

export default [
  /*********************************************/
  /* GROUP Getting Started as a Volunteer      */
  /*********************************************/
  {
    group: GoalGroup.VP_NEW,
    name: 'Complete your profile',
    slug: 'goal-complete-profile',
    subtitle: 'Help us recommend volunteering opportunities relevant to you',
    // badgeclass:
    imgUrl: '/static/img/goal/goal-complete-profile.png',
    description: `Complete your profile by adding a picture, 
      skills list, where you are, your job, things you are interested 
      in and tell us about yourself. 
      This helps us make great recommendations for 
      activities you should volunteer for and helps teachers select 
      the range of helpers they need for an activity`,
    preconditions: [],
    startLink: '/my/person',
    language: 'en',
    rank: 1,
    evaluation: async (personalGoal) => {
      const { score, count } = await GoalTests.personCompleteness(personalGoal)
      return (score / count * 100 > 85)
    }
  },
  {
    group: GoalGroup.VP_NEW,
    name: 'Get School Ready',
    slug: 'goal-school-ready',
    subtitle: 'Basic training for working with young people',
    badgeclass: 'Gp99Py5ERQGVeDFj63gizA',
    imgUrl: '/static/img/goal/goal-school-ready.png',
    description: `
We want you as a volunteer, and the young people and children
we work with to all to have brilliant experiences doing activities.

This goal will link you to some training materials that will 
help you feel more confident participating in school based activities..

Completing this goal will make you eligible for a wider range of 
volunteer opportunities.
`,
    preconditions: [],
    startLink: '/goal/school/ready',
    language: 'en',
    rank: 2,
    evaluation: (personalGoal) => GoalTests.personBadged(personalGoal)
  },
  {
    group: GoalGroup.VP_NEW,
    name: 'Get School Safe',
    slug: 'goal-school-safe',
    subtitle: 'Complete the vetting required for in-school volunteering',
    // badgeclass:
    imgUrl: '/static/img/goal/goal-school-safe.png',
    description: `
It is important that the young people and children
we work with to all be safe and secure while engaging in activities. 

This is why we run a confidential police check to verify that there
are no reasons you should not be working with children.

This goal will collect the required information and your permission to run the check.

`,
    preconditions: [],
    startLink: '/goal/school/safe',
    language: 'en',
    rank: 3,
    evaluation: () => { console.log('does person have school safe badge'); return false }
  },
  {
    group: GoalGroup.VP_NEW,
    name: 'Complete first volunteering activity',
    subtitle: 'Its time to find your first volunteering opportunity.',
    slug: 'goal-complete-first-activity',
    imgUrl: '/static/img/goal/goal-first-volunteer.png',
    description: `
Its time to find your first volunteering opportunity.

Below are some recommendations for events coming soon in your area. 
Or you can click *Start* here to open the search page.

Once you find something click the <strong>Interested</strong> button.
You can leave a message and the organiser will be notified.

You'll get an email notification and can accept or decline the invitation.
`,
    preconditions: [],
    startLink: '/search',
    language: 'en',
    rank: 3,
    evaluation: () => { console.log('does person have first-volunteer-activity badge'); return false }
  },

  /*********************************************/
  /* GROUP First steps for a new school        */
  /*********************************************/
  {
    group: GoalGroup.ORG_OP_NEW,
    name: 'Tell us about your school',
    slug: 'goal-complete-school-profile',
    subtitle: 'Tell the world about your awesome school - Complete profiles attract more volunteers!',
    description:
`Click Start below to open your school profile page, 

Click the Edit button, fill in the profile details, Then Save it. 

Once you have done that return to this page by clicking the 
*dashboard* menu. 

This card will disappear when the profile is complete
`,
    imgUrl: '/static/img/goal/goal-teacherSetup.png',
    startLink: '/my/org/op',
    rank: 1,
    evaluation: async (personalGoal) => {
      const { score, count } = await GoalTests.orgCompleteness(personalGoal, 'op')
      return (score / count * 100 > 75)
    }
  },
  {
    group: GoalGroup.ORG_OP_NEW,
    name: 'Run Inspiring the Future',
    slug: 'goal-run-itfb',
    imgUrl: '/static/img/goal/goal-itf.png',
    subtitle: 'Connect children and young people with volunteers from the world of work through this fun in-school activity.',
    description:
`Click Start below to open the Inspiring the Future Activity Template, 
If it sounds like something you could run in your school then click 
the DO THIS button. 

This creates a new Activity page where you can setup the time and place details

Once Published we will start finding volunteers
`,
    startLink: '/activity/inspiring-the-future',
    rank: 2,
    evaluation: (personalGoal) => GoalTests.activityStarted(personalGoal, 'inspiring-the-future')
  },

  /*********************************************/
  /* GROUP Register as a Teacher               */
  /*********************************************/
  {
    group: GoalGroup.OP_REGISTER,
    name: 'Confirm Teacher ID',
    slug: 'goal-confirm-teacher-id',
    subtitle: 'If you are a teacher, click here to enable creating new requests for volunteers.',
    imgurl: '/static/img/goal/goal-profile2.png',
    description: `
If you have not been automatically joined to a school you can enter your teacher
registration number to confirm that you are a teacher and thus enable the ability
to view activity templates and create new activities.    
`,
    startlink: '/action/registerTeacher',
    rank: 1,
    evaluation: () => { console.log('Confirm Teacher ID'); return false }
  },

  /*********************************************/
  /* GROUP First steps for teachers            */
  /*********************************************/
  {
    group: GoalGroup.OP_NEW,
    name: 'Find Activities',
    slug: 'goal-find-activities',
    subtitle: 'See templates that other educators have created for you to copy',
    description: 'Search the curated activities page filtering by age and curriculum topic',
    imgurl: '/static/img/actions/createAct.png',
    rank: 1,
    evaluation: () => { console.log('Find Activities'); return false }
  },
  {
    group: GoalGroup.OP_NEW,
    name: 'Create an Opportunity',
    slug: 'goal-create-new-opportunity',
    subtitle: 'Ask skilled volunteers for help by creating an opportunity to help out.',
    description: '',
    imgurl: '/static/img/actions/createOp.png',
    startlink: '/opportunity/registerTeacher',
    rank: 2,
    evaluation: () => { console.log('does person have first-volunteer-activity badge'); return false }
  },
  /*********************************************/
  /* GROUP More ways to help out               */
  /*********************************************/

  {
    group: GoalGroup.VP_MORE,
    name: 'Contribute to the platform',
    slug: 'goal-contribute-to-platform',
    subtitle: 'Help mobilise more volunteers by contributing. All skill levels are welcome, and training is provided.',
    description: '',
    imgurl: '/static/img/actions/github.png',
    startlink: 'https://github.com/voluntarily/vly2',
    rank: 1,
    evaluation: () => { console.log('Contribute to the platform'); return false }
  }
// {
//   name: '',
//   slug: '',
//   imgUrl: '/static/img/goal/goal-school-ready.png',
//   subtitle: '',
//   startLink: '/search',
//   group: 'Getting Started',
//   evaluation: () => { console.log('generic'); return false }
// },
]
