import React from 'react'
import test from 'ava'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

import ActMenu from '../ActMenu'

// Initialise activity menu
const actMenu = {
  'Discover': {
    'Top rated': 132,
    'Top trending': 150
  },
  'Categories': {
    'Science': 91312,
    'Programming': 1312,
    'Geology': 1312,
    'Ballet': 1239
  }
}

test('render the activity menu headers', t => {
  const wrapper = renderWithIntl(<Menu.ItemGroup>{Object.keys(actMenu[0])}</Menu.ItemGroup>)
  t.truthy(wrapper.find('Discover'))
})
