import React from 'react'
import test from 'ava'
import tagList from '../../../server/api/tag/__tests__/tag.fixture'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import OpShortForm from '../OpShortForm'
import sinon from 'sinon'
import { OpportunityStatus, OpportunityType } from '../../../server/api/opportunity/opportunity.constants'
const { sortedLocations } = require('../../../server/api/location/locationData')

// Initial opportunities
const op = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: 'PT1H22M',
  locations: ['Northland', 'Online'],
  date: [
    {
      $date: '2023-06-16T05:57:01.000Z'
    }
  ],
  status: OpportunityStatus.DRAFT,
  tags: tagList
}

const blankAsk = {
  name: '',
  type: OpportunityType.ASK,
  subtitle: '',
  imgUrl: '',
  description: '',
  duration: '',
  locations: ['Online'],
  status: OpportunityStatus.DRAFT,
  tags: [],
  date: []
}

const blankOffer = {
  name: '',
  type: OpportunityType.OFFER,
  subtitle: '',
  imgUrl: '',
  description: '',
  duration: '',
  locations: ['Online'],
  status: OpportunityStatus.DRAFT,
  tags: [],
  date: []
}

const locations = {
  locations: sortedLocations,
  addressFinderKey: 'hyijekahlfjsoe'
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

test('shallow the form with op', t => {
  const wrapper = shallowWithIntl(
    <OpShortForm
      op={op}
      onSubmit={() => {}}
      onCancel={() => {}}
      locations={locations}
      existingTags={[]}
    />
  )
  t.is(wrapper.find('.OpShortForm').length, 1)
})

test('render the form with op', async t => {
  t.plan(7)
  var done = sinon.promise()

  const cancelOp = sinon.spy()
  const submitOp = sinon.spy(o => {
    t.is(o.name, op.name)
    t.is(o.duration, op.duration)
    t.is(o.status, op.status)
    done.resolve('done')
  })
  const me = { _id: '5ccbffff958ff4833ed2188d' }

  const wrapper = mountWithIntl(
    <OpShortForm
      op={op}
      me={me}
      onSubmit={submitOp}
      onCancel={cancelOp}
      existingTags={[]}
      locations={locations}
    />
  )

  t.is(wrapper.find('OpShortForm').length, 1)
  t.is(wrapper.find('button').length, 3)
  wrapper.find('#backBtn').first().simulate('click')
  t.truthy(cancelOp.calledOnce)
  wrapper.find('form').first().simulate('submit')
  await done
  t.truthy(submitOp.calledOnce)
})

test('render the detail with new blank ask op', async t => {
  t.plan(4)
  const done = sinon.promise()
  const submitOp = sinon.spy(o => done.resolve())
  const cancelOp = sinon.fake()
  const me = { _id: '5ccbffff958ff4833ed2188d' }

  const wrapper = mountWithIntl(
    <OpShortForm
      op={blankAsk}
      me={me}
      onSubmit={submitOp}
      onCancel={cancelOp}
      existingTags={[]}
      locations={locations}
    />
  )

  // set the description
  const description = wrapper.find('#op_short_form_description').first()
  description.simulate('change', { target: { value: 'Hello World!' } })

  // TODO: work out how to test these other form fields.
  // console.log(wrapper.debug())
  // const datePicker = wrapper.find('.ant-picker')
  // datePicker.at(0).simulate('click') // Check if the dissable date method got called
  // datePicker.at(1).simulate('click') // Check if the dissable date method got called
  // t.is(datePicker.length, 2) // should find 1 date picker component

  // can't click submit until fields entered
  // wrapper.find('form').first().simulate('submit')
  // t.falsy(submitOp.calledOnce)
  // wrapper.update()
  // console.log(wrapper.debug())

  // const locationField = wrapper.find('OpFormLocation').first()
  // const locationInput = locationField.find('TagSelect').first()
  // locationInput.props().onChange(['Auckland'])
  // wrapper.update()

  const durationHours = wrapper.find('#op_short_form_durationHours input').first()
  durationHours.simulate('change', { target: { value: 10 } })

  const durationMinutes = wrapper.find('#op_short_form_durationMinutes input').first()
  durationMinutes.simulate('change', { target: { value: 25 } })

  wrapper.find('form').first().simulate('submit')
  await done
  t.truthy(submitOp.calledOnce)
  const result = submitOp.args[0][0]
  t.is(result.type, OpportunityType.ASK)
  t.is(result.description, 'Hello World!')
  t.is(result.duration, 'PT10H25M')
})

test('render the detail with new blank offer op', async t => {
  t.plan(4)
  const done = sinon.promise()
  const submitOp = sinon.spy(o => done.resolve())
  const cancelOp = sinon.fake()
  const me = {
    _id: '5ccbffff958ff4833ed2188d',
    orgMembership: [
      {
        organisation: {
          _id: 'a',
          name: 'Careys org',
          slug: 'carey-org'
        }
      }
    ]
  }
  const wrapper = mountWithIntl(
    <OpShortForm
      op={blankOffer}
      me={me}
      onSubmit={submitOp}
      onCancel={cancelOp}
      existingTags={[]}
      locations={locations}
    />
  )

  // set the description
  const description = wrapper.find('#op_short_form_description').first()
  description.simulate('change', { target: { value: 'Hello World!' } })

  const durationHours = wrapper.find('#op_short_form_durationHours input').first()
  durationHours.simulate('change', { target: { value: 8 } })

  const durationMinutes = wrapper.find('#op_short_form_durationMinutes input').first()
  durationMinutes.simulate('change', { target: { value: 22 } })

  // set the organisation selection
  // const org = wrapper.find('Select').first()
  // org.instance().onSelect({ value: '1234' })
  // wrapper.update()
  // console.log(org.debug())

  // submit the changes
  wrapper.find('form').first().simulate('submit')
  await done
  t.truthy(submitOp.calledOnce)
  const result = submitOp.args[0][0]
  t.is(result.type, OpportunityType.OFFER)
  t.is(result.description, 'Hello World!')
  t.is(result.duration, 'PT8H22M')
  // t.is(result.offerOrg, 'a')
})
