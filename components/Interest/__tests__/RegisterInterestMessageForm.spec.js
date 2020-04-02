import RegisterInterestMessageForm from '../RegisterInterestMessageForm'
import test from 'ava'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

test('show and cancel form', t => {
  const onSubmit = sinon.fake()

  const wrapper = mountWithIntl(
    <RegisterInterestMessageForm
      id='acceptRegisterInterestForm'
      title='Test Message Form'
      prompt='Test message prompt'
      showTerms={false}
      onSubmit={onSubmit}
      visible
    />)

  // click cancel to hide the form
  t.true(wrapper.exists('Button#cancelBtn'))
  wrapper.find('Button#cancelBtn').first().simulate('click')
  wrapper.update()
  t.true(onSubmit.calledOnce)
  t.true(onSubmit.calledWith(false))
})

test('show and accept form', t => {
  const onSubmit = sinon.fake()

  const wrapper = mountWithIntl(
    <RegisterInterestMessageForm
      id='acceptRegisterInterestForm'
      title='Test Message Form'
      prompt='Test message prompt'
      showTerms
      onSubmit={onSubmit}
      visible
    />)

  t.is(wrapper.find('a').first().props().href, '/terms')
  const comment = wrapper.find('textarea')
  comment.simulate('change', { target: { value: 'My Comment' } })

  // click Send to accept the form
  t.true(wrapper.exists('Button#sendBtn'))
  wrapper.find('Button#sendBtn').first().simulate('click')
  wrapper.update()
  t.true(onSubmit.calledOnce)
  t.true(onSubmit.calledWith(true, 'My Comment'))
})
