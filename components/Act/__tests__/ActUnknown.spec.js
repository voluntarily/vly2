import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import ActUnknown from '../ActUnknown'

test('shallow the card with some counts', t => {
  const wrapper = shallowWithIntl(
    <ActUnknown />
  )
  t.is((wrapper.find('MemoizedFormattedMessage').first().props().id), 'ActUnknown.NotFound')
})
