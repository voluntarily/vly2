import test from 'ava'
import { Ready as VolunteerReady, volunteerReadyQuiz, gssp } from '../../../pages/goal/volunteer/ready'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { hashObj } from '../../../components/quiz/quiz'
import mockRouter from '../../../server/util/mockRouter'

test.before('Setup Route', mockRouter('/ready'))

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

  const { props } = await gssp({ store })
  t.is(props.vqa.name, volunteerReadyQuiz[0].name)
  t.is(props.vqa.hash, hash)

  const wrapper = shallowWithIntl(<VolunteerReady {...props} me={me} />)

  t.true(wrapper.exists('VideoQuiz'))
  wrapper.find('VideoQuiz').props().onCompleted()
  t.true(t.context.router.push.calledOnce)
})
