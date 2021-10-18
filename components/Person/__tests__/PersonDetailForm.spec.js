import React from 'react'
import test from 'ava'
// import { JSDOM } from 'jsdom'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import objectid from 'objectid'
import tagList from '../../../server/api/tag/__tests__/tag.fixture'

import { PersonDetailFormWithAddressFinder, PersonDetailForm, permissionTrimFields } from '../PersonDetailForm'
import sinon from 'sinon'
import people from '../../../server/api/person/__tests__/person.fixture'
import { MockWindowScrollTo } from '../../../server/util/mock-dom-helpers'
import fetchMock from 'fetch-mock'
import { Role } from '../../../server/services/authorize/role'

const { sortedLocations } = require('../../../server/api/location/locationData')

const locations = {
  locations: sortedLocations,
  addressFinderKey: 'hyijekahlfjsoe'
}

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
  people.forEach(p => { p._id = objectid().toString() })
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

test('is the form wrapped in an Address Finder', t => {
  const wrapper = shallowWithIntl(
    <PersonDetailFormWithAddressFinder person={t.context.me} existingTags={tagList} locations={locations} onSubmit={() => {}} onCancel={() => {}} me={t.context.me} />
  )
  t.is(wrapper.find('PersonDetailForm').length, 1)
  t.is(wrapper.find('PersonDetailForm').prop('scriptLoaded'), false)
})

test('render the detail with op', t => {
  t.context.mockServer.get('end:/api/education', { body: ['small', 'medium', 'large'] })
  function checkSubmit (person) {
    t.is(person, t.context.me)
  }
  const cancelOp = sinon.spy()
  const submitOp = sinon.spy(checkSubmit)
  const wrapper = mountWithIntl(
    <PersonDetailForm
      person={t.context.me}
      existingTags={tagList}
      locations={locations}
      onSubmit={submitOp}
      onCancel={cancelOp}
      me={t.context.me}
    />
  )
  // console.log(wrapper.debug())
  t.true(wrapper.exists('TagSelect'))
  const locationInput = wrapper.find('TagSelect').first()
  locationInput.props().onChange(['Auckland'])

  t.true(wrapper.exists('EducationSelector'))
  const educationSelector = wrapper.find('EducationSelector').first()
  educationSelector.props().onChange('medium')
  // wrapper.find('ImageUpload').first().props().setImgUrl('https://example.com/picture.png')

  t.is(wrapper.find('TagInput').length, 0)
  t.is(wrapper.find('button').length, 2)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelOp.calledOnce)
  // wrapper.find('ForwardRef(InternalForm)').first().simulate('submit')
  wrapper.simulate('submit')
  // test here is caught by the onSubmit handler
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
