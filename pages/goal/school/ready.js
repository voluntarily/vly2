import securePage from '../../../hocs/securePage'
import { FullPage } from '../../../components/VTheme/VTheme'
import readyqs from './ready.qs.js'
import { VideoQuestions, hashObj } from '../../../components/quiz/quiz'

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
