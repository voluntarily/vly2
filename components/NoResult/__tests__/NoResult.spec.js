import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import NoResult from '../NoResult'

test('Card include name school/org imgUrl location duration and subtitle', t => {
  const wrapper = mountWithIntl(
    <NoResult
      id='act.noresult'
      msg='No activities found based on your search criteria'
      description='Message shown while no activities found'
    />
  )
  t.true(wrapper.exists('Result'))
  t.is(wrapper.find('MemoizedFormattedMessage').first().text(), 'No activities found based on your search criteria')
})
