import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { Role } from '../../../server/services/authorize/role'

import ActTryBelow from '../ActTryBelow'

// Initial activities
const act = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  space: '1 acre',
  volunteers: '0.2',
  location: 'Newmarket, Auckland',
  status: 'draft'
}

test('shallow the card with some counts', t => {
  const counts = { ask: 2, offer: 1 }
  const wrapper = shallowWithIntl(
    <ActTryBelow act={act} counts={counts} role={Role.OPPORTUNITY_PROVIDER} />
  )

  t.is((wrapper.find('MemoizedFormattedMessage').first().props().id), 'ActTryBelow.prompt')
})

test('shallow the card with no OP', t => {
  const counts = { ask: 2, offer: 1 }
  const wrapper = shallowWithIntl(
    <ActTryBelow act={act} counts={counts} role={Role.BASIC} />
  )

  t.false(wrapper.exists('FormattedMessage'))
})
