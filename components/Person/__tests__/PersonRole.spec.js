import test from 'ava'
import PersonRoles, { PersonRole } from '../PersonRole'
// import { shallow, render } from 'enzyme'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

test('Person Role renders properly', t => {
  t.is(renderWithIntl(<PersonRole role='volunteer' />).text(), 'Volunteer')
  t.is(renderWithIntl(<PersonRole role='support' />).text(), 'Help Desk')
})

test('Person Role list renders properly', t => {
  const roles = [
    'volunteer',
    'support',
    'activityProvider'
  ]
  const wrapper = renderWithIntl(<PersonRoles roles={roles} />)
  t.regex(wrapper.find('span').first().text(), /Volunteer/)
  t.regex(wrapper.find('span').last().text(), /Activity Provider/)
})

test('Person Role list renders blank when given no roles', t => {
  const wrapper = renderWithIntl(<PersonRoles />)
  t.is(wrapper.text(), '')
})

test('Person Role list renders nothing when its an unknown role', t => {
  const roles = [
    'author'
  ]
  const wrapper = renderWithIntl(<PersonRoles roles={roles} />)
  t.is(wrapper.text(), '')
})
