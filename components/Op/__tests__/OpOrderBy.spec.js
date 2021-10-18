import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import OpOrderBy from '../OpOrderby'
import sinon from 'sinon'

test('render sorting order', t => {
  const wrapper = shallowWithIntl(
    <OpOrderBy />
  )
  const options = wrapper.find('Option')
  t.is(options.length, 3)
  const dateOption = options.first().find('MemoizedFormattedMessage').first()
  t.is(dateOption.props().id, 'sortDate')
})

test('simulate change', t => {
  t.plan(2)
  const handleSort = sinon.fake((sortOrder) => t.is(sortOrder, 'name'))
  const wrapper = shallowWithIntl(
    <OpOrderBy onChange={handleSort} />
  )
  wrapper.find('ForwardRef(InternalSelect)').first().simulate('change', 'name')
  t.true(handleSort.calledOnce)
})
