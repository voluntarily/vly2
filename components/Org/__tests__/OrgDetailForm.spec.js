import React from 'react'
import test from 'ava'
// import { JSDOM } from 'jsdom'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import objectid from 'objectid'

import OrgDetailForm from '../OrgDetailForm'
import sinon from 'sinon'
import organisations from '../../../server/api/organisation/__tests__/organisation.fixture'

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
  t.log(wrapper)
  // console.log(wrapper.html())
  t.is(wrapper.find('OrgDetailForm').length, 1)
  t.is(wrapper.find('button').length, 2)
  wrapper.find('button').first().simulate('click')
  t.truthy(cancelOp.calledOnce)
  wrapper.find('Form').first().simulate('submit')
  t.truthy(submitOp.calledOnce)
  t.truthy(submitOp.calledWith(t.context.org))
})
