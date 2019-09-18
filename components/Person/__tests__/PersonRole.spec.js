import test from 'ava'
import PersonRoles, { PersonRole } from '../PersonRole'
// import { shallow, render } from 'enzyme'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

const roles = [
  'volunteer',
  'tester'
]

test('Person Role renders properly', t => {
  t.is(renderWithIntl(<PersonRole role='volunteer' />).text(), 'Volunteer')
  t.is(renderWithIntl(<PersonRole role='tester' />).text(), 'Test')
})

test('Person Role list renders properly', t => {
  const wrapper = renderWithIntl(<PersonRoles roles={roles} />)
  t.is(wrapper.find('span').first().text(), 'Volunteer ')
  t.is(wrapper.find('span').last().text(), 'Test')
})
