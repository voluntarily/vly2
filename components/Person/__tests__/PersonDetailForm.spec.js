import React from 'react'
import test from 'ava'
// import { JSDOM } from 'jsdom'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import objectid from 'objectid'
import tagList from '../../../server/api/tag/__tests__/tag.fixture'

import { PersonDetailForm, permissionTrimFields } from '../PersonDetailForm'
import sinon from 'sinon'
import people from '../../../server/api/person/__tests__/person.fixture'
import { MockWindowScrollTo } from '../../../server/util/mock-dom-helpers'
import fetchMock from 'fetch-mock'
import { Role } from '../../../server/services/authorize/role'

const { sortedLocations } = require('../../../server/api/location/locationData')

MockWindowScrollTo.replaceForTest(test, global)

test.before(t => {
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
})

test.afterEach(t => {
  fetchMock.reset()
})

test.before('Setup People fixtures', (t) => {
  // not using mongo or server here so faking ids
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]

  t.context.me = me
  t.context.people = people
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
    <PersonDetailForm person={t.context.me} existingTags={tagList} locations={sortedLocations} onSubmit={() => {}} onCancel={() => {}} me={t.context.me} />
  )
  t.is(wrapper.find('PersonDetail').length, 1)
})

test('render the detail with op', t => {
  t.context.mockServer.get('end:/api/education', { body: ['small', 'medium', 'large'] })

  const submitOp = sinon.spy()
  const cancelOp = sinon.spy()

  const wrapper = mountWithIntl(
    <PersonDetailForm person={t.context.me} existingTags={tagList} locations={sortedLocations} onSubmit={submitOp} onCancel={cancelOp} me={t.context.me} />
  )
  const locationInput = wrapper.find('TagSelect').first()
  locationInput.props().onChange(['Auckland'])

  t.true(wrapper.exists('ForwardRef(EducationSelector)'))
  const educationSelector = wrapper.find('ForwardRef(EducationSelector)').first()
  educationSelector.props().onChange('medium')
  // wrapper.find('ImageUpload').first().props().setImgUrl('https://example.com/picture.png')

  t.is(wrapper.find('PersonDetail').length, 1)
  t.is(wrapper.find('TagInput').length, 1)
  t.is(wrapper.find('button').length, 2)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelOp.calledOnce)
  wrapper.find('Form').first().simulate('submit')
  t.truthy(submitOp.calledOnce)
  t.truthy(submitOp.calledWith(t.context.me))
})

for (const role of [Role.ACTIVITY_PROVIDER, Role.OPPORTUNITY_PROVIDER, Role.ORG_ADMIN, Role.RESOURCE_PROVIDER, Role.VOLUNTEER]) {
  test(`permissionTrimFields - email field is removed if ${role}`, t => {
    const person = {
      email: 'abc@xyz.com'
    }

    permissionTrimFields(person, [role])

    t.is(person.email, undefined)
  })
}

for (const role of [Role.ADMIN, Role.SUPPORT]) {
  test(`permissionTrimFields - email field is included if ${role}`, t => {
    const person = {
      email: 'abc@xyz.com'
    }

    permissionTrimFields(person, [Role.ADMIN])

    t.is('abc@xyz.com', person.email)
  })
}
