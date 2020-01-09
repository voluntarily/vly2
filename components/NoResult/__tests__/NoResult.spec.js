import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import NoResult from '../NoResult'

test('NoResult with existing translation', t => {
  // there is an existing translation for the id "test" with the value "Test"
  // so the value of the `msg` prop here should not be used
  const wrapper = mountWithIntl(
    <NoResult
      id='test'
      msg='this message should not be used'
      description='test message description'
    />
  )

  t.is(wrapper.find('.ant-result-title').text(), 'Test')
})

test('NoResult with non-existing translation', t => {
  const wrapper = mountWithIntl(
    <NoResult
      id='notavalidid.test'
      msg='this message should be used'
      description='test message description'
    />
  )

  t.is(wrapper.find('.ant-result-title').text(), 'this message should be used')
})
