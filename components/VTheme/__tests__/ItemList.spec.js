import test from 'ava'
import { ItemVolunteers, ItemListing, ItemDuration } from '../ItemList'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

test('render ItemListing', t => {
  const wrapper = renderWithIntl(<ItemListing />)
  t.truthy(wrapper.find(ItemListing))
})

test('render duration if the value is 3 hours', t => {
  const wrapper = renderWithIntl(<ItemDuration duration='3 hours' />)
  t.is(wrapper.text(), '⏱ Duration:   3 hours')
})

test('render Volunteers per student properly if the value is < 1', t => {
//   t.context.act.volunteers = 0.2
  const wrapper = renderWithIntl(<ItemVolunteers volunteers={0.2} type='act' />)
  t.is(wrapper.text(), '🙋 Volunteers per student:5')
})
test('render volunteer properly if the value is >= 1', t => {
//   t.context.act.volunteers = 5
  const wrapper = renderWithIntl(<ItemVolunteers volunteers={5} type='act' />)
  t.is(wrapper.text(), '🙋 Volunteers:   5')
})
test('render volunteer values === 0 properly', t => {
//   t.context.volunteers = 0
  const wrapper = renderWithIntl(<ItemVolunteers volunteers={0} type='act' />)
  t.is(wrapper.text(), '')
})
