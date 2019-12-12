import test from 'ava'
import { ItemVolunteers } from '../ItemList'
import { render } from 'enzyme'

test('render Volunteers per student properly if the value is < 1', t => {
//   t.context.act.volunteers = 0.2
  const wrapper = render(<ItemVolunteers volunteers={0.2} type='act' />)
  t.is(wrapper.find('span').first().text(), 'Volunteers per student:')
})
test('render volunteer properly if the value is >= 1', t => {
//   t.context.act.volunteers = 5
  const wrapper = render(<ItemVolunteers volunteers={5} type='act' />)
  t.is(wrapper.find('span').first().text(), 'Volunteers:')
})
test('render volunteer values === 0 properly', t => {
//   t.context.volunteers = 0
  const wrapper = render(<ItemVolunteers volunteers={0} type='act' />)
  t.is(wrapper.find('span').first().text(), '')
})
