import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'

import ActReadMore from '../ActReadMore'

// Initial activities
const act = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden'
}

test('shallow the card with act', t => {
  const wrapper = shallowWithIntl(
    <ActReadMore act={act} />
  )
  t.is(wrapper.find('strong').text(), act.name)
})
