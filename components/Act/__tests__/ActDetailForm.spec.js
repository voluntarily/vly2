import React from 'react'
import test from 'ava'
import orgs from '../../../server/api/organisation/__tests__/organisation.fixture'
import people from '../../../server/api/person/__tests__/person.fixture'
import tagList from '../../../server/api/tag/__tests__/tag.fixture'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import objectid from 'objectid'
import ActDetailForm from '../ActDetailForm'
import sinon from 'sinon'
import { MemberStatus } from '../../../server/api/member/member.constants'
import { MockWindowScrollTo } from '../../../server/util/mock-dom-helpers'

MockWindowScrollTo.replaceForTest(test, global)

const noact = {
  name: '',
  subtitle: '',
  imgUrl: '',
  description: '',
  duration: '',
  equipment: [],
  status: 'draft',
  volunteers: 1,
  tags: []
}

// Suppress console warning messages from async validator as they mess up the test output
const orginalWarn = console.warn

test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    orginalWarn(...args)
  }
})

test.before('Setup Organisations fixtures', (t) => {
  // not using mongo or server here so faking ids
  people.forEach(p => { p._id = objectid().toString() })
  const me = people[0]

  // two orgs are aps
  orgs.forEach(p => { p._id = objectid().toString() })
  const org = orgs[0]

  // fake my membership
  const members = [
    {
      person: me._id,
      organisation: orgs[0],
      status: MemberStatus.MEMBER
    },
    {
      person: me._id,
      organisation: orgs[1],
      status: MemberStatus.MEMBER
    }
  ]
  me.orgMembership = members

  const act = {
    _id: '5cc903e5f94141437622cea7',
    name: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    status: 'draft',
    tags: tagList,
    owner: me._id,
    offerOrg: orgs[0]
  }

  t.context = {
    me,
    act,
    org,
    orgs,
    members,
    people
  }
})

test.after.always(() => {
  console.warn = orginalWarn
})

test('shallow the detail with act', t => {
  const wrapper = shallowWithIntl(
    <ActDetailForm
      act={t.context.act}
      onSubmit={() => {}}
      onCancel={() => {}}
      existingTags={[]}
    />
  )
  t.is(wrapper.find('ActDetailForm').length, 1)
})

test('render the detail with act', t => {
  const act = t.context.act
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const me = t.context.me
  const wrapper = mountWithIntl(
    <ActDetailForm
      act={act}
      me={me}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]}
    />
  )
  t.is(wrapper.find('ActDetailForm').length, 1)
  t.is(wrapper.find('button').length, 5)
  wrapper.find('#cancelActBtn').first().simulate('click')
  t.truthy(cancelAct.calledOnce)
  wrapper.find('#publishActBtn').first().simulate('click')
  t.truthy(submitAct.calledOnce)
  t.truthy(submitAct.calledWith(act))

  // clear the title to see an error message
  const name = wrapper.find('input#activity_detail_form_name').first()
  // name.node.value = 'Test'
  name
    .simulate('change', { target: { value: '' } })
  wrapper.update()
  t.is(wrapper.find('.ant-legacy-form-explain').first().text(), 'Title is required')
})

test('toggle radio buttons', t => {
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const radioAct = sinon.spy()
  const volunteerInputAct = sinon.spy()
  // const inputField1 = sinon.spy()
  const wrapper = mountWithIntl(
    <ActDetailForm
      act={t.context.act}
      onClick={radioAct}
      onChange={volunteerInputAct}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]}
      me={t.context.me}
    />
  )
  t.is(wrapper.find('ActDetailForm').length, 1)
  t.is(wrapper.find('Radio').length, 2)

  const radioButton = wrapper.find('Radio')
  const input1 = wrapper.find('input#activity_detail_form_totalVolunteerRequired').first()
  const input2 = wrapper.find('input#activity_detail_form_volunteerPerStudent').first()

  radioButton.at(0).props().onClick({ target: { value: 'option1' } })
  input1.props().onChange({ target: { name: 'resourceinput1', value: 10 } })
  wrapper.find('#publishActBtn').first().simulate('click')
  t.is(t.context.act.volunteers, 10)
  t.regex(t.context.act.volunteers.toString(), /^\d+$/)
  radioButton.at(1).props().onClick({ target: { value: 'option2' } })
  input2.props().onChange({ target: { name: 'resourceinput2', value: 5 } })
  wrapper.find('#publishActBtn').first().simulate('click')
  t.is(t.context.act.volunteers, 0.2)
})
test('componentDidMount - set volunteer to 0.2', t => {
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const radioAct = sinon.spy()
  const volunteerInputAct = sinon.spy()
  t.context.act.volunteers = 0.2
  const wrapper = mountWithIntl(
    <ActDetailForm
      act={t.context.act}
      onClick={radioAct}
      onChange={volunteerInputAct}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]}
      me={t.context.me}
    />
  )
  const comdidmount = sinon.spy(wrapper.instance(), 'componentDidMount')
  wrapper.instance().componentDidMount()
  t.truthy(comdidmount.calledOnce)
})
test('componentDidMount - set volunteer to 10', t => {
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const radioAct = sinon.spy()
  const volunteerInputAct = sinon.spy()
  t.context.act.volunteers = 10
  const wrapper = mountWithIntl(
    <ActDetailForm
      act={t.context.act}
      onClick={radioAct}
      onChange={volunteerInputAct}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]}
      me={t.context.me}
    />
  )
  const comdidmount = sinon.spy(wrapper.instance(), 'componentDidMount')
  wrapper.instance().componentDidMount()
  t.truthy(comdidmount.calledOnce)
})

test('componentDidMount - set volunteer to 0', t => {
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const radioAct = sinon.spy()
  const volunteerInputAct = sinon.spy()
  t.context.act.volunteers = 0
  const wrapper = mountWithIntl(
    <ActDetailForm
      act={t.context.act}
      onClick={radioAct}
      onChange={volunteerInputAct}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]}
      me={t.context.me}
    />
  )
  const comdidmount = sinon.spy(wrapper.instance(), 'componentDidMount')
  wrapper.instance().componentDidMount()
  t.truthy(comdidmount.calledOnce)
})
test('render the detail with new blank act', t => {
  const submitAct = sinon.spy()
  const cancelAct = sinon.spy()
  const me = { _id: '5ccbffff958ff4833ed2188d' }

  const wrapper = mountWithIntl(
    <ActDetailForm
      act={noact}
      me={me}
      onSubmit={submitAct}
      onCancel={cancelAct}
      existingTags={[]}
    />
  )
  t.is(wrapper.find('ActDetailForm').length, 1)
  t.is(wrapper.find('button').length, 5)
  wrapper.find('#cancelActBtn').first().simulate('click')
  t.truthy(cancelAct.calledOnce)

  // can't click submit until fields entered
  wrapper.find('#saveActBtn').at(1).simulate('click')
  t.falsy(submitAct.calledOnce)
  wrapper.update()
  // should see title is required
  // find name field.
  const name = wrapper.find('input#activity_detail_form_name').first()
  // name.node.value = 'Test'
  name
    .simulate('keydown', { which: 'a' })
    .simulate('change', { target: { value: 'My new value' } })
  wrapper.update()

  const durationHours = wrapper.find('input#activity_detail_form_durationHours').first()
  durationHours.simulate('change', { target: { value: 10 } })
  const durationMinutes = wrapper.find('input#activity_detail_form_durationMinutes').first()
  durationMinutes.simulate('change', { target: { value: 25 } })

  // fake select an image
  // const testImg = 'https://example.com/img/banana.jpeg'
  // const imgUpload = wrapper.find('ImageUpload').first()
  // imgUpload.props().setImgUrl(testImg)

  // save the resulting activity
  // wrapper.find('#publishActBtn').at(1).simulate('click')
  // t.truthy(submitAct.calledOnce)
  // const actResult = submitAct.args[0][0]
  // t.is(actResult.imgUrl, testImg)
})
