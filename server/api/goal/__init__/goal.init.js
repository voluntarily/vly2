/* eslint-disable no-undef */
/*
  This list of goals is loaded into the database by calling
  /api/xadmin/loadGoals
*/
export default [
  {
    name: 'Complete your profile',
    slug: 'goal-complete-profile',
    subtitle: 'Help us recommend volunteering opportunities relevant to you',
    // badge:
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
    category: 'Getting Started',
    rank: 1,
    evaluation: () => { console.log('Complete your profile'); return false }
  },
  {
    name: 'Get School Ready',
    slug: 'goal-school-ready',
    subtitle: 'Complete the training and vetting necessary to work with young people',
    // badge:
    imgUrl: '/static/img/goal/goal-school-ready.png',
    description: `
We want you as a volunteer, and the young people and children
we work with to all to have brilliant experiences doing activities.

So we ask you to complete some training materials about what you can
and can't do in schools, how to behave and what to expect.

We also run a confidential background police check to verify that there
is no reason you should not be working with children.

This goal will collect the required information and permission to run the check
and then send you on a short online training course to get you briefed.
Once completed you'll receive the 'School Ready' badge and teachers will know
you are someone they can trust in their classrooms.

Don't worry if you have started the process but don't think it will be
completed in time - there are ways we can handle that.
`,
    preconditions: [],
    startLink: '/todo',
    language: 'en',
    category: 'Getting Started',
    rank: 2,
    evaluation: () => { console.log('does person have school ready badge'); return false }
  },
  {
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
    category: 'Getting Started',
    rank: 3,
    evaluation: () => { console.log('does person have first-volunteer-activity badge'); return false }
  },
  {
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
    category: 'Get Started for Teachers',
    rank: 1,
    evaluation: async (personalGoal) => {
      const { score, count } = await GoalTests.orgCompleteness(personalGoal, 'op')
      return (score / count * 100 > 75)
    }
  },
  {
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
    category: 'Get Started for Teachers',
    rank: 2,
    evaluation: (personalGoal) => GoalTests.activityStarted(personalGoal, 'inspiring-the-future')
  },
  {
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
    category: 'Register as a Teacher',
    rank: 1,
    evaluation: () => { console.log('Confirm Teacher ID'); return false }
  },
  {
    name: 'Find Activities',
    slug: 'goal-find-activities',
    subtitle: 'See templates that other educators have created for you to copy',
    description: '',
    imgurl: '/static/img/actions/createAct.png',
    category: 'Next Steps for Teachers',
    rank: 1,
    evaluation: () => { console.log('Find Activities'); return false }
  },
  {
    name: 'Create an Opportunity',
    slug: 'goal-create-new-opportunity',
    subtitle: 'Ask skilled volunteers for help by creating an opportunity to help out.',
    description: '',
    imgurl: '/static/img/actions/createOp.png',
    startlink: '/opportunity/registerTeacher',
    category: 'Next Steps for Teachers',
    rank: 2,
    evaluation: () => { console.log('does person have first-volunteer-activity badge'); return false }
  },
  {
    name: 'Contribute to the platform',
    slug: 'goal-contribute-to-platform',
    subtitle: 'Help mobilise more volunteers by contributing. All skill levels are welcome, and training is provided.',
    description: '',
    imgurl: '/static/img/actions/github.png',
    startlink: 'https://github.com/voluntarily/vly2',
    category: 'More ways to help out',
    rank: 1,
    evaluation: () => { console.log('Contribute to the platform'); return false }
  }
// {
//   name: '',
//   slug: '',
//   imgUrl: '/static/img/goal/goal-school-ready.png',
//   subtitle: '',
//   startLink: '/search',
//   category: 'Getting Started',
//   evaluation: () => { console.log('generic'); return false }
// },
]
