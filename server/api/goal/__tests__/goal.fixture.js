export default [
  { //   name - a short name that indicates what needs to be done - these use verbs and active voice.
    //   e.g  Complete your profile,
    //        Get Police Vetted
    //        Attend your first event
    //        Complete your safety training
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
    startLink: '/home', // should be /profile#edit
    language: 'en',
    category: 'Getting Started',
    rank: 1,
    evaluation: () => { console.log('evaluates to false'); return false },
    dateAdded: '2019-11-27T10:00:00.000Z'
  },
  {
    name: 'Get School Ready',
    slug: 'goal-school-ready',
    subtitle: 'Complete the training and vetting necessary to work with young people',
    // badge:
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
        Once completed you'll receive the 'School Ready' badge and teachers will know
        you are someone they can trust in their classrooms.
    </p>
    <p>Don't worry if you have started the process but don't think it will be
        completed in time - there are ways we can handle that.
    </p>
  </section>`,
    preconditions: [],
    startLink: '/home', // should be /profile#edit
    language: 'en',
    category: 'Getting Started',
    rank: 2,
    evaluation: () => { console.log('evaluates to true'); return true },
    dateAdded: '2019-11-27T10:00:00.000Z'
  },
  {
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
      <em>Volunteer</em> badge and this card will disappear.
    </p>
  </section>`,
    preconditions: [],
    startLink: '/search',
    language: 'en',
    category: 'First Activity',
    evaluation: () => { return true },
    dateAdded: '2019-11-27T10:00:00.000Z'
  },
  {
    name: 'Test 3 Thrower',
    slug: 'test-003',
    imgUrl: '/static/img/goal/goal-school-ready.png',
    subtitle: 'Test 3',
    startLink: '/search',
    category: 'Throwers',
    evaluation: () => {
      console.log('Throws an error')
      throw new Error('testing')
    }
  }

]
