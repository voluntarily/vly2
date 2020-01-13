import test from 'ava'
import { Ready as SchoolReady } from '../../../pages/goal/school/ready'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { hashObj } from '../../../components/quiz/quiz'
import quiz from '../../../components/quiz/__tests__/quiz.fixture'
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
  const hash = hashObj(quiz[0].answers, email)
  const RoutedSchoolReady = withMockRoute(SchoolReady)

  const props = await SchoolReady.getInitialProps({ store })
  t.is(props.vqa.name, 'Are you School Ready?')
  t.is(props.vqa.hash, hash)

  const outer = shallowWithIntl(<RoutedSchoolReady {...props} me={me} />)

  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()

  t.true(wrapper.exists('VideoQuiz'))
  wrapper.find('VideoQuiz').props().onCompleted()
  t.true(router.push.calledOnce)
})
