export const quizFixture = [
  {
    name: 'Are you Volunteer Ready?',
    description: 'Watch this video to learn what you need to know when working in a school',
    badgeclass: 'Gp99Py5ERQGVeDFj63gizA',
    src: 'https://www.youtube.com/embed/N0Ktkx8SYH0',
    questions: [
      {
        name: 'Offersname',
        q: 'What is the name of the Offer?',
        options: [
          'Tohu',
          'Tane',
          'Tama',
          'Tana'
        ]
      },
      {
        name: 'Food',
        q: 'What activity was requested?',
        options: [
          'Remote Working Policies',
          'Delivering Medication',
          'Groceries Delivery',
          'Redux Tutorial'
        ]
      },
      {
        name: 'Sharon',
        q: 'What is the name of the person asking for help?',
        options: [
          'Shannon',
          'Shaza',
          'Sam',
          'Sharon'
        ]
      },
      {
        name: 'ActivityTab',
        q: 'Which of these are not a tab found on the Activity Detail page?',
        options: [
          'About',
          'Ask',
          'Offer',
          'Collaboration'
        ]
      }
    ],
    answers: {
      Offername: 2,
      Food: 2,
      Sharon: 3,
      ActivityTab: 3
    }
  }
]
export default quizFixture
