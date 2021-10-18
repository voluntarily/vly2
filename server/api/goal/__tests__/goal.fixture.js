import { GoalGroup } from '../goalGroup'

export default [
  { //   name - a short name that indicates what needs to be done - these use verbs and active voice.
    //   e.g  Complete your profile,
    //        Get Police Vetted
    //        Attend your first event
    //        Complete your safety training
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
    startLink: '/home', // should be /profile#edit
    language: 'en',
    rank: 1,
    evaluation: "() => { console.log('evaluates to false'); return false }",
    createdAt: '2019-11-27T10:00:00.000Z'
  },
  {
    group: GoalGroup.VP_NEW,
    name: 'Get School Ready',
    slug: 'goal-school-ready',
    subtitle: 'Complete the training and vetting necessary to work with young people',
    // badgeclass:
    imgUrl: '/static/img/goal/goal-school-ready.png',
    description: `
  <section>
    <p>We want you as a volunteer, and the young people and children
        we work with to all to have brilliant experiences doing activities.
        So we ask you to complete some training materials about what you can
        and can't do in schools, how to behave and what to expect.
    </p>
    <p>
        We also run a confidential background police check to verify that there
        is no reason you should not be working with children.
    </p>
    <p>This goal will collect the required information and permission to run the check
        and then send you on a short online training course to get you briefed.
        Once completed you'll receive the 'School Ready' badgeclass and teachers will know
        you are someone they can trust in their classrooms.
    </p>
    <p>Don't worry if you have started the process but don't think it will be
        completed in time - there are ways we can handle that.
    </p>
  </section>`,
    preconditions: [],
    startLink: '/home', // should be /profile#edit
    language: 'en',
    rank: 2,
    evaluation: "() => { console.log('evaluates to true'); return true }",
    createdAt: '2019-11-27T10:00:00.000Z'
  },
  {
    group: GoalGroup.VP_NEW,
    name: 'Complete first volunteering activity',
    slug: 'goal-complete-first-activity',
    imgUrl: '/static/img/goal/goal-school-ready.png',
    description: `
  <section>
    <p>
      <strong>Its time to find your first volunteering opportunity.</strong>
        If you have filled in location, skills &amp; interests in your profile
        you will now see some recommendations for events that will be taking
        place soon in your area, or might particularly interest you.
        Alternatively you can click the link below to go to the search page.
    </p>
    <p>
      Once you find some things you might be interested in click the
      <strong>Interested</strong> button to follow the activity.
      You can leave a message and the organiser will be notified.
      This is not a firm commitment yet.
    </p>
    <p>
      The organiser can review the profiles of interested people and send
      out invitations to participate in the activity. You'll get an email
      notification and can accept or decline the invitation.
    </p>
    <p>
      Once you have attended the activity you'll get your first
      <em>Volunteer</em> badgeclass and this card will disappear.
    </p>
  </section>`,
    preconditions: [],
    startLink: '/search',
    language: 'en',
    evaluation: '() => { return true }',
    createdAt: '2019-11-27T10:00:00.000Z'
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
    evaluation: 'async (personalGoal) => { return false }'
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
    evaluation: 'async (personalGoal) => { return true }'
  },

  {
    group: GoalGroup.ORG_OP_NEW,
    name: 'Test 3 Thrower',
    slug: 'test-003',
    imgUrl: '/static/img/goal/goal-school-ready.png',
    subtitle: 'Test 3',
    startLink: '/search',
    evaluation: `() => {
      console.log('Throws an error');
      throw new Error('testing')
    }`
  }

]
