/* eslint-disable no-undef */
/*
  This list of goals is loaded into the database by calling
  /api/xadmin/loadGoals
*/
const { GoalGroup } = require('../goalGroup')

module.exports = [
  /***********************************************/
  /* GROUP VP_NEW Getting Started as a Volunteer */
  /***********************************************/
  {
    group: GoalGroup.VP_NEW,
    name: 'Complete your profile',
    slug: 'goal-complete-profile',
    subtitle: 'Help us recommend volunteering opportunities relevant to you',
    // badgeclass:
    imgUrl: '/static/img/goal/goal-complete-profile.png',
    description: 'Complete your profile by adding a picture, skills list, where you are, your job, things you are interested in and tell us about yourself. It is really important to fill in your location and your skills. This will mean it will be easier to match you once we are ready to go.',
    preconditions: [],
    startLink: '/my/person',
    language: 'en',
    rank: 1,
    evaluation: async (personalGoal) => {
      const { score, count } = await GoalTests.personCompleteness(personalGoal)
      return (score / count * 100 > 85)
    }
  },
  /*  {
    group: GoalGroup.VP_NEW,
    name: 'Basic Training for Voluntarily',
    slug: 'goal-volunteer',
    subtitle: 'What you need to know',
    badgeclass: 'Gp99Py5ERQGVeDFj63gizA',
    imgUrl: '/static/img/goal/goal-school-ready.png',
    description: `
We want you as a volunteer, and the people you help out to have a great experience and be safe.

This goal will link you to some training materials that will
help you feel more confident participating.

`,
    preconditions: [],
    startLink: '/goal/volunteer/ready',
    language: 'en',
    rank: 2,
    evaluation: (personalGoal) => { return GoalTests.personBadged(personalGoal) }
  },
  {
    group: GoalGroup.VP_NEW,
    name: 'Find someone to help',
    subtitle: 'Its time to find your first volunteer opportunity.',
    slug: 'goal-find-first-activity',
    imgUrl: '/static/img/goal/goal-first-volunteer.png',
    description: `
Its time to find your first volunteering opportunity.

On the discover tab below you'll see opportunities to help that match up with the location and skills in your profile
Or you can click *Start* to open the search page and browse what is going on.

Once you find something click the <strong>Get Involved</strong> button.
You can leave a message and the requestor will be notified.
`,
    preconditions: [],
    startLink: '/search',
    language: 'en',
    rank: 3,
    evaluation: (personalGoal) => { return GoalTests.personInterested(personalGoal) }
  }, */

  /***********************************************/
  /* GROUP SCHOOL_VP_NEW Getting Started in schools */
  /***********************************************/
  {
    group: GoalGroup.SCHOOL_VP_NEW,
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
    rank: 3,
    evaluation: (personalGoal) => { return GoalTests.personBadged(personalGoal) }
  },
  {
    group: GoalGroup.SCHOOL_VP_NEW,
    name: 'Get School Safe',
    slug: 'goal-school-safe',
    subtitle: 'Complete the vetting required for in-school volunteering',
    badgeclass: 'I-1iMG8UT827wCrRXVDzzg', // schoolsafe-test
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
    rank: 4,
    evaluation: (personalGoal) => { return GoalTests.personBadged(personalGoal) }
  },

  /*********************************************/
  /* GROUP First steps for a new school        */
  /*********************************************/
  {
    group: GoalGroup.ORG_OP_NEW,
    name: 'Tell us about your group',
    slug: 'goal-complete-school-profile',
    subtitle: 'Tell the world about your awesome group - Complete profiles attract more volunteers!',
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
      const { score, count } = await GoalTests.orgCompleteness(personalGoal, OrganisationRole.OPPORTUNITY_PROVIDER)
      return (score / count * 100 > 75)
    }
  },
  {
    group: GoalGroup.ORG_OP_NEW,
    name: 'Run an activity',
    slug: 'goal-run-first-activity',
    imgUrl: '/static/img/goal/goal-run-activity.png',
    subtitle: 'Coming very soon. We make it easy to ask for exactly what you need',
    description:
`Click Start below to review existing template activities. See if there is one you or your group might be able to offer or want to ask for help with.

This creates a new request page where you can setup the specific details

Once Published we will try to match it with people who can help.
`,
    startLink: '/acts',
    rank: 2,
    evaluation: (personalGoal) => GoalTests.activityStarted(personalGoal, '')
  },

  /*********************************************/
  /* GROUP First steps for offer / ask            */
  /*********************************************/
  {
    group: GoalGroup.OP_NEW,
    name: 'Find Activities you can offer or request',
    slug: 'goal-find-activities',
    subtitle: 'Search the curated activities page',
    description: 'See templates for some common activities that you might want to ask for help with, or offer to help with',
    imgUrl: '/static/img/actions/createAct.png',
    rank: 1,
    evaluation: () => { return false }
  },
  {
    group: GoalGroup.OP_NEW,
    name: 'Ask for volunteers to help you',
    slug: 'goal-create-new-ask-opportunity',
    subtitle: 'Ask volunteers for help by creating a request to help out.',
    description: '',
    imgUrl: '/static/img/actions/createOpAsk.png',
    startLink: '/op/ask',
    rank: 2,
    evaluation: () => { return false }
  },
  {
    group: GoalGroup.OP_NEW,
    name: 'Offer help or resources to others',
    slug: 'goal-create-new-offer-opportunity',
    subtitle: 'What can you offer others?',
    description: 'Create a new listing of what you can do, or what resources you can offer to others.',
    imgUrl: '/static/img/actions/createOpOffer.png',
    startLink: '/op/offer',
    rank: 2,
    evaluation: () => { return false }
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
    imgUrl: '/static/img/actions/github.png',
    startLink: 'https://github.com/voluntarily/vly2',
    rank: 1,
    evaluation: () => { return false }
  },
  /*********************************************/
  /* GROUP Register as a Teacher               */
  /*********************************************/
  {
    group: GoalGroup.OP_REGISTER,
    name: 'Confirm Teacher ID',
    slug: 'goal-confirm-teacher-id',
    subtitle: 'If you are a teacher, click here to enable creating new requests for volunteers.',
    imgUrl: '/static/img/goal/goal-profile2.png',
    description: `
If you have not been automatically joined to a school you can enter your teacher
registration number to confirm that you are a teacher and thus enable the ability
to view activity templates and create new activities.    
`,
    startLink: '/action/registerTeacher',
    rank: 1,
    evaluation: () => { console.log('Confirm Teacher ID'); return false }
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
