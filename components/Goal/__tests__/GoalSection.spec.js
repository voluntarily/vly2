import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import goals from '../../../server/api/goal/__tests__/goal.fixture'
import { GoalSection } from '../GoalSection'

test('shallow the list with goals', t => {
  const wrapper = shallowWithIntl(
    <GoalSection goals={goals} />
  )
  t.is(wrapper.find('MemoizedFormattedMessage').first().props().id, 'GoalSection.VP_NEW.title')
  t.is(wrapper.find('GoalList').length, 1)
})

test('shallow the list with no goals', t => {
  const wrapper = shallowWithIntl(
    <GoalSection goals={[]} />
  )
  t.is(wrapper.text(), '')
})
