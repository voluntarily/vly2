/* A video and questions data object contains the url for a video, title and about text
followed by an array of questions.
*/

export default [
  {
    name: 'Are you School Ready?',
    description: 'Watch this video to learn what you need to know when working in a school',
    step: 1,
    src: 'https://www.youtube.com/embed/kv8GrLpfVNo',
    next: 'ready2.qs.js',
    questions: [
      {
        name: 'tShirt',
        q: 'What does Vaughan have on his t-shirt?',
        options: [
          'Unicorn',
          'Dinosaur',
          'Robot bee',
          'Jandals'
        ]
      },
      {
        name: 'launchDate',
        q: 'When does Voluntarily Launch?',
        options: [
          '2020',
          '2021',
          '2022'
        ]
      }
    ],
    answers: {
      tShirt: 1,
      launchDate: 0
    }
  }

]
