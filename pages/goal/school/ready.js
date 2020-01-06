import securePage from '../../../hocs/securePage'
import { FullPage } from '../../../components/VTheme/VTheme'
import { VideoQuestions, hashObj } from '../../../components/quiz/quiz'

const readyqs = [
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

const Ready = ({ vqa, me }) => {
  const handleSubmit = success => {
    if (success) {
      // do the next thing
      console.log('Test Passed issue badge')
    }
  }
  return (
    <FullPage>
      <VideoQuestions vqa={vqa} me={me} onSubmit={handleSubmit} />
    </FullPage>
  )
}
Ready.getInitialProps = async ({ store }) => {
  const vqa = { ...readyqs[0] } // TODO: move to database
  vqa.hash = hashObj(vqa.answers, store.getState().session.me.email)
  delete vqa.answers
  return { vqa }
}

export default securePage(Ready)
