import React from 'react'
import test from 'ava'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'
import { ShareLinks } from '../OpShareLinks'

const appUrl = 'https://www.testUrl.com'

test('render share links', t => {
  const wrapper = renderWithIntl(<ShareLinks url={appUrl} />, { context: '' })
  t.truthy(wrapper.find('div'))
  t.truthy(wrapper.find('FacebookShareButton'))
  t.truthy(wrapper.find('TwitterShareButton'))
  t.truthy(wrapper.find('LinkedinShareButton'))
  t.truthy(wrapper.find('WhatsappShareButton'))
})