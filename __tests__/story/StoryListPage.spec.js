import test from 'ava'
import React from 'react'
import { storyListPage } from 'pages/story/StoryListPage'
import { mountWithIntl } from '../lib/react-intl-test-helper'

test('render english', t => {
  const wrapper = mountWithIntl(<storyListPage />)
  t.is(wrapper.find('h1').first().text(), 'Story List')
})
