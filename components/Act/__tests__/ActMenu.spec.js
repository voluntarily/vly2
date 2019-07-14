import React from 'react'
import test from 'ava'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

import ActMenu from '../ActMenu'

// TO DO: Fix test as it is currently a false positive. 

test('render the activity menu headers', t => {
  const wrapper = renderWithIntl(<ActMenu />)
  t.truthy(wrapper.find('Discover'))
})
