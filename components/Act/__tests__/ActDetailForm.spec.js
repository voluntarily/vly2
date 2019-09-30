import React from 'react'
import test from 'ava'
// import { JSDOM } from 'jsdom'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'

import ActDetailForm from '../ActDetailForm'
import sinon from 'sinon'
// import { wrap } from 'module'
// Initial activities

const act = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  status: 'draft',
  volunteers: 2
}

const noact = {
  name: '',
  subtitle: '',
  imgUrl: '',
  description: '',
  duration: '',
  status: 'draft',
  volunteers: null
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

test('toggle radio buttons', async t => {
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const radioAct = sinon.spy()
  const volunteerInputAct = sinon.spy()
  // const inputField1 = sinon.spy()
  const wrapper = mountWithIntl(
    <ActDetailForm
      act={act}
      onClick={radioAct}
      onChange={volunteerInputAct}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]}
    />
  )
  t.is(wrapper.find('ActDetailForm').length, 1)
  t.is(wrapper.find('button').length, 3)
  t.is(wrapper.find('Radio').length, 2)

  const radioButton = wrapper.find('Radio')
  const input1 = wrapper.find('input#activity_detail_form_totalVolunteerRequired').first()
  const input2 = wrapper.find('input#activity_detail_form_volunteerPerStudent').first()

  radioButton.at(0).props().onClick({ target: { value: 'option1' } })
  input1.props().onChange({ target: { name: 'resourceinput1', value: 10 } })
  // console.log(act.volunteers)
  wrapper.find('button').at(1).simulate('click')
  t.is(act.volunteers, 10)
  t.regex(act.volunteers.toString(), /^\d+$/)
  // console.log(act.volunteers)
  radioButton.at(1).props().onClick({ target: { value: 'option2' } })
  input2.props().onChange({ target: { name: 'resourceinput2', value: 5 } })
  // console.log(act.volunteers)
  wrapper.find('button').at(1).simulate('click')
  t.is(act.volunteers, 5)
  // console.log(act.volunteers)
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

// radioButton.at(0).simulate('change', { target: { value: 'option1' } })
//   // wrapper.find('Radio').first().simulate('change', { target: { value: 'option1' } })
//   // wrapper.find('input#activity_detail_form_totalVolunteerRequired').first()
//   //   .simulate('change', { target: { value: 5 } })
//   input1.simulate('change', { target: { value: 10 } })
//   console.log(radioButton.at(0).html().includes('option1'))
//   console.log(input1.html())
//   // wrapper.update()
//   wrapper.find('button').first().simulate('click')
//   t.truthy(cancelAct.calledOnce)
//   wrapper.find('button').at(1).simulate('click')
//   t.truthy(submitAct.called)
//   console.log(act.volunteers)

//   // t.truthy(submitAct.calledOnce)
//   t.regex(act.volunteers.toString(), /^\d+$/)

//   // radioButton.at(1).simulate('click')
//   // input2.simulate('change', { target: { value: 10 } })
//   // console.log(radioButton.at(1).html())
//   // console.log(input2.html())

//   // // input2.instance().value = 10
//   // // input2.simulate('change')

//   // wrapper.find('button').first().simulate('click')
//   // t.truthy(cancelAct.calledOnce)
//   // wrapper.find('button').at(1).simulate('click')
//   // // t.truthy(submitAct.calledOnce)
//   // console.log(act)
