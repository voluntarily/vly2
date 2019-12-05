import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { ShareLinks } from '../OpShareLinks'

test('render social medias', t => {
  const appUrl = 'https://www.testUrl.com'
  const wrapper = shallowWithIntl(<ShareLinks url={appUrl} />)
  t.truthy(wrapper.find('FacebookShareButton'))
  t.truthy(wrapper.find('TwitterShareButton'))
  t.truthy(wrapper.find('LinkedinShareButton'))
  t.truthy(wrapper.find('WhatsappShareButton'))
})
