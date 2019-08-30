import React from 'react'
import test from 'ava'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

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
  const wrapper = renderWithIntl(<OpDetail op={t.context.op} onPress={() => {}} />)
  console.log(wrapper.html())
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), t.context.op.name)
})

// test.todo('verify markdown in description is rendered')
