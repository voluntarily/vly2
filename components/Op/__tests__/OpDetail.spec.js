import React from 'react'
import test from 'ava'
import withMockRoute from '../../../server/util/mockRouter'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
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

test('render the detail properly', t => {
  const RoutedOpDetail = withMockRoute(OpDetail, `/ops/${t.context.op._id}`)
  const wrapper = mountWithIntl(
    <RoutedOpDetail op={t.context.op}/> 
  )
  // const wrapper = renderWithIntl(<OpDetail op={t.context.op} onPress={() => {}} />)
  t.truthy(wrapper.find('Head'))
  t.truthy(wrapper.find('ShareLink'))
  t.is(wrapper.find('h1').text(), t.context.op.name)
})

// test.todo('verify markdown in description is rendered')

