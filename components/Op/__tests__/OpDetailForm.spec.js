import React from 'react'
import test from 'ava'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'

import OpDetailForm from '../OpDetailForm'
import sinon from 'sinon'
// Initial opportunities
const op = {
  _id: '5cc903e5f94141437622cea7',
  title: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  location: 'Newmarket, Auckland',
  status: 'draft'
}

const noop = {
  title: '',
  subtitle: '',
  imgUrl: '',
  description: '',
  duration: '',
  location: '',
  status: 'draft'
}

// Suppress console warning messages from async validator as they mess up the test output
const orginalWarn = console.warn
test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    orginalWarn(...args)
  }
})

test.after.always(() => {
  console.warn = orginalWarn
})

test('shallow the detail with op', t => {
  const wrapper = shallowWithIntl(
    <OpDetailForm op={op} onSubmit={() => {}} onCancel={() => {}} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('OpDetailForm').length, 1)
})

test('render the detail with op', t => {
  const submitOp = sinon.spy()
  const cancelOp = sinon.spy()
  const me = { _id: '5ccbffff958ff4833ed2188d' }

  const wrapper = mountWithIntl(
    <OpDetailForm op={op} me={me} onSubmit={submitOp} onCancel={cancelOp} />
  )
  // console.log(wrapper.html())
  t.is(wrapper.find('OpDetailForm').length, 1)
  t.is(wrapper.find('button').length, 2)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelOp.calledOnce)
  wrapper.find('Form').first().simulate('submit')
  t.truthy(submitOp.calledOnce)
  t.truthy(submitOp.calledWith(op))
})

test.serial('render the detail with new blank op', t => {
  const submitOp = sinon.spy()
  const cancelOp = sinon.spy()
  const me = { _id: '5ccbffff958ff4833ed2188d' }

  const wrapper = mountWithIntl(
    <OpDetailForm op={noop} me={me} onSubmit={submitOp} onCancel={cancelOp} />
  )
  // console.log(wrapper.html())
  t.is(wrapper.find('OpDetailForm').length, 1)
  t.is(wrapper.find('button').length, 2)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelOp.calledOnce)

  // can't click submit until fields entered
  wrapper.find('Form').first().simulate('submit')
  t.falsy(submitOp.calledOnce)
  wrapper.update()
  // console.log(wrapper.html())
  // find title field.
  const title = wrapper.find('input#opportunity_detail_form_title').first()
  // title.node.value = 'Test'
  title
    .simulate('keydown', { which: 'a' })
    .simulate('change', { target: { value: 'My new value' } })
  wrapper.update()

  const duration = wrapper.find('input#opportunity_detail_form_duration').first()
  duration.simulate('change', { target: { value: '10 hours' } })

  wrapper.find('Form').first().simulate('submit')
  t.truthy(submitOp.calledOnce)
})
