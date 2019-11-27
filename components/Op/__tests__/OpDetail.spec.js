import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper.js'

import OpDetail from '../OpDetail'
import ops from './Op.fixture'

test.before('Setup fixtures', (t) => {
  // Initial opportunities
  t.context.ops = ops
  t.context.op = ops[0]
  t.context.archivedOp = {
    ...ops[1],
    status: 'completed'
  }
})

test('render the detail with op', t => {
  const wrapper = mountWithIntl(<OpDetail op={t.context.op} onPress={() => {}} />)
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), t.context.op.name)
})

test.serial('render the tabs', t => {
  const wrapper = mountWithIntl(<OpDetail op={t.context.op} onPress={() => {}} />)
  t.is(wrapper.find('.ant-tabs-tab').at(0).text(), 'About')
  t.is(wrapper.find('.ant-tabs-tab').at(1).text(), 'Questions')
  t.is(wrapper.find('.ant-tabs-tab').at(2).text(), 'Updates')
})
// test.todo('verify markdown in description is rendered')
