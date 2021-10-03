import securePage from '../../../hocs/securePage'
import { FullPage } from '../../../components/VTheme/VTheme'
import { VideoQuiz, hashObj } from '../../../components/quiz/quiz'
import Router from 'next/router'
import Head from 'next/head'

const readyqs = [
  {
    name: 'Are you School Ready?',
    description: 'Watch this video to learn what you need to know when working in a school',
    src: 'https://www.youtube.com/embed/kv8GrLpfVNo',
    badgeclass: 'Gp99Py5ERQGVeDFj63gizA',
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

export const Ready = ({ vqa, me }) => {
  const handleCompleted = () => {
    Router.push('/')
  }
  return (
    <FullPage>
      <Head>
        <title>SchoolReady - Voluntarily</title>
      </Head>
      <VideoQuiz vqa={vqa} me={me} onCompleted={handleCompleted} />
    </FullPage>
  )
}
Ready.getInitialProps = async ({ store }) => {
  const vqa = { ...readyqs[0] } // TODO: move to database
  vqa.hash = hashObj(vqa.answers, store.getState().session.me.email)
  delete vqa.answers
  return { vqa }
}

export default Ready
