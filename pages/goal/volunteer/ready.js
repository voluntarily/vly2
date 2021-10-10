import { FullPage } from '../../../components/VTheme/VTheme'
import { VideoQuiz, hashObj } from '../../../components/quiz/quiz'
import Router from 'next/router'
import Head from 'next/head'
import reduxWrapper from '../../../lib/redux/store'

export const volunteerReadyQuiz = [
  {
    name: 'Are you ready to volunteer?',
    description: 'Watch this video to learn what you need to know when volunteering.',
    src: 'https://www.youtube.com/embed/N0Ktkx8SYH0',
    badgeclass: '5e1e3adb46e0fb0034694f6c',
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
        q: 'What is the name of the person asking for help??',
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
      Offersname: 2,
      Food: 2,
      Sharon: 3,
      ActivityTab: 3
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
        <title>Volunteer Ready - Voluntarily</title>
      </Head>
      <VideoQuiz vqa={vqa} me={me} onCompleted={handleCompleted} />
    </FullPage>
  )
}
export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

export const gssp = async ({ store, query }) => {
  const vqa = { ...volunteerReadyQuiz[0] } // TODO: move to database
  vqa.hash = hashObj(vqa.answers, store.getState().session.me.email)
  delete vqa.answers
  return { props: { vqa } }
}

export default Ready
