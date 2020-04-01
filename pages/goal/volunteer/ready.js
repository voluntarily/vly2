import securePage from '../../../hocs/securePage'
import { FullPage } from '../../../components/VTheme/VTheme'
import { VideoQuiz, hashObj } from '../../../components/quiz/quiz'
import Router from 'next/router'
import { Helmet } from 'react-helmet'

const readyqs = [
  {
    name: 'Are you ready to volunteer?',
    description: 'Watch this video to learn what you need to know when volunteering with Voluntarily.',
    src: 'https://www.youtube.com/embed/N0Ktkx8SYH0',
    badgeclass: 'Gp99Py5ERQGVeDFj63gizA',
    questions: [
      {
        name: 'tama',
        q: 'What does Vaughan have on his t-shirt?',
        options: [
          'Unicorn',
          'Dinosaur',
          'Robot bee',
          'Jandals'
        ]
      },
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
      <Helmet>
        <title>Volunteer Ready - Voluntarily</title> 
      </Helmet>
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

export default securePage(Ready)
