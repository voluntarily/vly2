import test from 'ava'
import { Ready as SchoolReady } from '../../../pages/goal/school/ready'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { hashObj } from '../../../components/quiz/quiz'
import quiz from '../../../components/quiz/__tests__/quiz.fixture'

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

  const props = await SchoolReady.getInitialProps({ store })
  t.is(props.vqa.name, 'Are you School Ready?')
  t.is(props.vqa.hash, hash)

  const wrapper = shallowWithIntl(<SchoolReady {...props} me={me} />)
  t.true(wrapper.exists('VideoQuiz'))
  wrapper.find('VideoQuiz').props().onSubmit(true)
  wrapper.find('VideoQuiz').props().onSubmit(false)
})
