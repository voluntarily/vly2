import React from 'react'
import test from 'ava'
// import { JSDOM } from 'jsdom'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import objectid from 'objectid'
import tagList from '../../../server/api/tag/__tests__/tag.fixture'

import PersonDetailForm from '../PersonDetailForm'
import sinon from 'sinon'
import people from '../../../server/api/person/__tests__/person.fixture'
import { MockWindowScrollTo } from '../../../server/util/mock-dom-helpers'

const { sortedLocations } = require('../../../server/api/location/locationData')

MockWindowScrollTo.replaceForTest(test, global)

test.before('Setup People fixtures', (t) => {
  // not using mongo or server here so faking ids
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]

  t.context = {
    me,
    people
  }
})

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

test('shallow the detail with person', t => {
  const wrapper = shallowWithIntl(
    <PersonDetailForm person={t.context.me} existingTags={tagList} locations={sortedLocations} onSubmit={() => {}} onCancel={() => {}} />
  )
  t.is(wrapper.find('PersonDetailForm').length, 1)
})

test('render the detail with op', t => {
  const submitOp = sinon.spy()
  const cancelOp = sinon.spy()

  const wrapper = mountWithIntl(
    <PersonDetailForm person={t.context.me} existingTags={tagList} locations={sortedLocations} onSubmit={submitOp} onCancel={cancelOp} />
  )
  const locationInput = wrapper.find('LocationSelector').first()
  locationInput.props().onChange('Auckland')

  t.is(wrapper.find('PersonDetailForm').length, 1)
  t.is(wrapper.find('TagInput').length, 1)
  t.is(wrapper.find('button').length, 2)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelOp.calledOnce)
  wrapper.find('Form').first().simulate('submit')
  t.truthy(submitOp.calledOnce)
  t.truthy(submitOp.calledWith(t.context.me))
})
