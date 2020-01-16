import test from 'ava'
import React from 'react'
import { StoryDetailPage } from '../../pages/story/storydetailpage'
import { mountWithIntl } from '../../lib/react-intl-test-helper'

test('test story detail', t => {
  const wrapper = mountWithIntl(<StoryDetailPage />)
  t.is(wrapper.find('h1').first().text(), 'Story Detail')
})
