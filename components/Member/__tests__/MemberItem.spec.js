import MemberItem from '../MemberItem'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

test('constructs properly', t => {
  const wrapper = mountWithIntl(<MemberItem member={{
    person: { nickname: 'Test Name' },
    organisation: 'Test Organisation',
    validation: 'Test Validation',
    status: 'Test Status',
    _id: '11223344'
  }} />)

  t.truthy(wrapper.find('.person.nickname'), 'Test Name')
  t.truthy(wrapper.find('.organisation'), 'Test Organisation')
  t.truthy(wrapper.find('.validation'), 'Test Validation')
  t.truthy(wrapper.find('.status'), 'Test Status')
  t.truthy(wrapper.find('._id'), '11223344')
})
