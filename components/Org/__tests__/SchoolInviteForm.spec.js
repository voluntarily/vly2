import React from 'react'
import test from 'ava'
import SchoolInviteForm from '../SchoolInviteForm'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import sinon from 'sinon'

// Suppress console warning and errors messages from async validator as they mess up the test output
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    originalConsoleWarn(...args)
  }

  console.error = () => {}
})

test.after.always(() => {
  console.warn = originalConsoleWarn
  console.error = originalConsoleError
})

test('Form renders', (t) => {
  const wrapper = shallowWithIntl(
    <SchoolInviteForm onSubmit={() => {}} schoolOptions={[]} />
  )

  t.is(wrapper.find('SchoolInviteForm').length, 1)
})

test('Empty form fails validation, does not submit', t => {
  const onSubmitSpy = sinon.spy()

  const wrapper = mountWithIntl(
    <SchoolInviteForm onSubmit={onSubmitSpy} schoolOptions={[]} />
  )

  t.is(wrapper.find('SchoolInviteForm').length, 1)
  t.is(wrapper.find('button').length, 1)

  wrapper.find('Form').first().simulate('submit')
  t.truthy(onSubmitSpy.notCalled, 'onSubmit should not be called because of validation error')

  t.is(wrapper.find('.has-error').length, 3, '3 fields should be marked as having an error')
})

test('Valid form submits with expected values', async t => {
  const onSubmitSpy = sinon.spy(() => true)

  const setInputValue = (selector, text) => {
    wrapper
      .find(selector)
      .first()
      .simulate('change', { target: { value: text } })
  }

  const wrapper = mountWithIntl(
    <SchoolInviteForm onSubmit={onSubmitSpy} schoolOptions={[{ schoolId: 1, name: 'Test school' }]} />
  )

  setInputValue('#inviteeName', 'Test Testington')
  setInputValue('#inviteeEmail', 'test@example.com')
  wrapper.find('Select').first().prop('onChange')(1)
  setInputValue('#invitationMessage', 'Test message')

  wrapper.find('Form').first().simulate('submit')

  t.truthy(onSubmitSpy.calledOnce)
  t.truthy(onSubmitSpy.calledWithMatch({
    inviteeName: 'Test Testington',
    inviteeEmail: 'test@example.com',
    schoolId: 1,
    invitationMessage: 'Test message'
  }))
})
