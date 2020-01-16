import test from 'ava'
import React from 'react'
import { StoryListPage } from '../../pages/story/storylistpage'
import { mountWithIntl } from '../../lib/react-intl-test-helper'

test('test story list', t => {
  const wrapper = mountWithIntl(<StoryListPage />)
  t.is(wrapper.find('h1').first().text(), 'Story List')
})
