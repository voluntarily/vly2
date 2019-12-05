import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import goals from '../../../server/api/goal/__tests__/goal.fixture'
import GoalList from '../GoalList'

test('shallow the list with goals', t => {
  const wrapper = shallowWithIntl(
    <GoalList goals={goals} />
  )
  t.is(wrapper.find('Connect(GoalCard)').length, goals.length)
})
