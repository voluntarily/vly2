import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import goals from '../../../server/api/goal/__tests__/goal.fixture'
import GoalSection from '../GoalSection'

test('shallow the list with goals', t => {
  const wrapper = shallowWithIntl(
    <GoalSection goals={goals} />
  )
  t.is(wrapper.find('VTheme__H3Black').first().text(), goals[0].category)
  t.is(wrapper.find('GoalList').length, 1)
})
