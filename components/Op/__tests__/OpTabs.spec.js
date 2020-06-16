import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { OpTabs } from '../OpTabs'
import { OpportunityStatus } from '../../../server/api/opportunity/opportunity.constants'
import sinon from 'sinon'

test('render OpTabs for active op', t => {
  const handleChange = sinon.fake()
  const op = {
    _id: 'fakeid',
    name: 'Test Opportunity',
    status: OpportunityStatus.ACTIVE
  }
  const wrapper = shallowWithIntl(
    <OpTabs
      op={op}
      onChange={handleChange}
      canManage={false}
      canEdit={false}
      defaultTab='about'
      author='TestyId'
    />
  )
  t.is(wrapper.find('TabPane').length, 3)
  t.true(wrapper.exists('OpAboutPanel'))
  t.true(wrapper.exists('OpQuestionPanel'))
  t.false(wrapper.exists('OpManagePanel'))
})

test('render OpTabs for manager', t => {
  const handleChange = sinon.fake()
  const op = {
    _id: 'fakeid',
    name: 'Test Opportunity',
    status: OpportunityStatus.ACTIVE
  }
  const wrapper = shallowWithIntl(
    <OpTabs
      op={op}
      onChange={handleChange}
      canManage
      canEdit={false}
      defaultTab='about'
      author='TestyId'
    />
  )
  t.is(wrapper.find('TabPane').length, 4)

  t.true(wrapper.exists('OpAboutPanel'))
  t.true(wrapper.exists('OpQuestionPanel'))
  t.true(wrapper.exists('OpManagePanel'))
})

test('render OpTabs for editor', t => {
  const handleChange = sinon.fake()
  const op = {
    _id: 'fakeid',
    name: 'Test Opportunity',
    status: OpportunityStatus.ACTIVE
  }
  const wrapper = shallowWithIntl(
    <OpTabs
      op={op}
      onChange={handleChange}
      canManage
      canEdit
      defaultTab='about'
      author='TestyId'
    />
  )
  t.is(wrapper.find('TabPane').length, 5)
  t.true(wrapper.exists('OpAboutPanel'))
  t.true(wrapper.exists('OpQuestionPanel'))
  t.true(wrapper.exists('OpManagePanel'))
})
