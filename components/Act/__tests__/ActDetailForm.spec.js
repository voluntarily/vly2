import React from 'react'
import test from 'ava'
// import { JSDOM } from 'jsdom'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'

import ActDetailForm from '../ActDetailForm'
import sinon from 'sinon'
// Initial activities

const act = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  status: 'draft'
}

const noact = {
  name: '',
  subtitle: '',
  imgUrl: '',
  description: '',
  duration: '',
  status: 'draft'
}

// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p`)
// global.window = dom// setting a mock window global object so the upload image component is not complaining
// global.SVGElement = Array
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

test('shallow the detail with act', t => {
  const wrapper = shallowWithIntl(
    <ActDetailForm
      act={act}
      onSubmit={() => {}}
      onCancel={() => {}}
      existingTags={[]} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('ActDetailForm').length, 1)
})

test('render the detail with act', t => {
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const me = { _id: '5ccbffff958ff4833ed2188d' }
  const wrapper = mountWithIntl(
    <ActDetailForm
      act={act}
      me={me}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]} />
  )
  t.is(wrapper.find('ActDetailForm').length, 1)
  t.is(wrapper.find('button').length, 3)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelAct.calledOnce)
  wrapper.find('button').at(1).simulate('click')
  t.truthy(submitAct.calledOnce)
  t.truthy(submitAct.calledWith(act))
})

test.serial('render the detail with new blank act', t => {
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const me = { _id: '5ccbffff958ff4833ed2188d' }

  const wrapper = mountWithIntl(
    <ActDetailForm
      act={noact}
      me={me}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]} />
  )
  t.log(wrapper.first())
  t.is(wrapper.find('ActDetailForm').length, 1)
  t.is(wrapper.find('button').length, 3)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelAct.calledOnce)

  // can't click submit until fields entered
  wrapper.find('button').at(1).simulate('click')
  t.falsy(submitAct.calledOnce)
  wrapper.update()
  // console.log(wrapper.html())
  // find name field.
  const name = wrapper.find('input#activity_detail_form_name').first()
  // name.node.value = 'Test'
  name
    .simulate('keydown', { which: 'a' })
    .simulate('change', { target: { value: 'My new value' } })
  wrapper.update()

  const duration = wrapper.find('input#activity_detail_form_duration').first()
  duration.simulate('change', { target: { value: '10 hours' } })

  wrapper.find('button').at(1).simulate('click')
  t.truthy(submitAct.calledOnce)
})
