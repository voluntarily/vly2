import test from 'ava'
import { Ready as VolunteerReady, volunteerReadyQuiz } from '../../../pages/goal/volunteer/ready'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { hashObj } from '../../../components/quiz/quiz'
import withMockRoute from '../../../server/util/mockRouter'
import sinon from 'sinon'
test('render OpList', async t => {
  // first test GetInitialProps
  const email = 'testy@voluntarily.nz'
  const me = { email }
  const store = {
    getState: () => {
      return ({ session: { me } })
    }
  }
  const hash = hashObj(volunteerReadyQuiz[0].answers, email)
  const RoutedVolunteerReady = withMockRoute(VolunteerReady)

  const props = await getServerSideProps({ store })
  t.is(props.vqa.name, volunteerReadyQuiz[0].name)
  t.is(props.vqa.hash, hash)

  const outer = shallowWithIntl(<RoutedVolunteerReady {...props} me={me} />)

  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()

  t.true(wrapper.exists('VideoQuiz'))
  wrapper.find('VideoQuiz').props().onCompleted()
  t.true(router.push.calledOnce)
})
