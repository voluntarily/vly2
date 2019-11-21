import React from 'react'
import test from 'ava'
// import { JSDOM } from 'jsdom'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import objectid from 'objectid'

import OrgDetailForm, { validateAgeRange } from '../OrgDetailForm'
import sinon from 'sinon'
import organisations from '../../../server/api/organisation/__tests__/organisation.fixture'
import { Category } from '../../../server/api/organisation/organisation.constants'
import { MockWindowScrollTo } from '../../../server/util/mock-dom-helpers'

test.before('Setup Organisations fixtures', (t) => {
  // not using mongo or server here so faking ids
  organisations.map(p => { p._id = objectid().toString() })
  const org = organisations[0]

  t.context = {
    org,
    organisations
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

test('shallow the detail with organisation', t => {
  const wrapper = shallowWithIntl(
    <OrgDetailForm org={t.context.org} onSubmit={() => {}} onCancel={() => {}} />
  )
  t.is(wrapper.find('OrgDetailForm').length, 1)
})

test('render the detail with op', t => {
  const submitOp = sinon.spy()
  const cancelOp = sinon.spy()

  const wrapper = mountWithIntl(
    <OrgDetailForm org={t.context.org} onSubmit={submitOp} onCancel={cancelOp} />
  )
  t.is(wrapper.find('OrgDetailForm').length, 1)
  t.is(wrapper.find('button').length, 2)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelOp.calledOnce)
  wrapper.find('Form').first().simulate('submit')
  t.truthy(submitOp.calledOnce)
  t.truthy(submitOp.calledWith(t.context.org))
})

test('Age range field is shown when organisation category is school', async t => {
  const wrapper = mountWithIntl(
    <OrgDetailForm org={t.context.org} onSubmit={() => {}} onCancel={() => {}} />
  )

  const categories = wrapper.find('#organisation_detail_form_category').first()
  t.truthy(categories)

  // Check the School checkbox which causes the Age Range field to display
  const school = wrapper
    .find(`#organisation_detail_form_category input[value="${Category.SCHOOL}"]`)
    .first()
  school.simulate('change')

  // Assert the Age Range field is present
  t.is(wrapper.find('label[htmlFor="organisation_detail_form_ageRange"]').length, 1)
})

test('Fields are submitted', async t => {
  global.window.scrollTo = new MockWindowScrollTo().scrollTo

  const submitOp = sinon.spy()

  const wrapper = mountWithIntl(
    <OrgDetailForm org={t.context.org} onSubmit={submitOp} onCancel={() => {}} />
  )

  // Organisation name
  wrapper.find('#organisation_detail_form_name').first()
    .simulate('change', { target: { value: 'Test org' } })

  // School dependent fields
  wrapper.find(`#organisation_detail_form_category input[value="${Category.SCHOOL}"]`).first()
    .simulate('change')

  // Age range
  const ageRange = wrapper.find('NumericRange#organisation_detail_form_ageRange').first()
  ageRange.find('.numeric-range-from input').first()
    .simulate('change', { target: { value: '10' } })
  ageRange.find('.numeric-range-to input').first()
    .simulate('change', { target: { value: '99' } })

  // Decile
  wrapper.find('.decile input').first()
    .simulate('change', { target: { value: '8' } })

  // Submit the form
  wrapper.find('Form').first().simulate('submit')

  // Assert
  t.truthy(submitOp.calledOnce)
  t.truthy(submitOp.calledWithMatch({
    name: 'Test org',
    ageRange: {
      from: 10,
      to: 99
    },
    decile: 8
  }))
})

test('validateAgeRange - no age range value', t => {
  t.true(validateAgeRange(undefined))
})
test('validateAgeRange - from and to fields valid', t => {
  t.true(validateAgeRange({
    from: 5,
    to: 100
  }))
})
test('validateAgeRange - only from field', t => {
  t.true(validateAgeRange({
    from: 5
  }))
})
test('validateAgeRange - only to field', t => {
  t.true(validateAgeRange({
    to: 500
  }))
})
test('validateAgeRange - to less than from', t => {
  t.false(validateAgeRange({
    from: 10,
    to: 5
  }))
})
