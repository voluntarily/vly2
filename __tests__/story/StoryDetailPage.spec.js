import test from 'ava'
import React from 'react'
import { storyDetailPage } from '../pages/story/storyDetailPage'
import { mountWithIntl } from '../lib/react-intl-test-helper'

test('render english', t => {
  const wrapper = mountWithIntl(<storyDetailPage />)
  t.is(wrapper.find('h1').first().text(), 'Story Detail')
})
