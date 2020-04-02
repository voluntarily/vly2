import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'

import ActCardSuggest from '../ActCardSuggest'

test('shallow the card with act', t => {
  const wrapper = shallowWithIntl(
    <ActCardSuggest />
  )
  t.is(wrapper.find('figcaption').find('h1').first().text(), 'Suggest a topic')
})
