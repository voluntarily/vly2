import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

import TagDisplay from '../TagDisplay'

const originalWarn = console.warn

const tags = [
  { tag: 'test' },
  { tag: 'wowzer' }
]

test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    originalWarn(...args)
  }
})

test.after.always(() => {
  console.warn = originalWarn
})

test.serial('render tags', t => {
  const wrapper = mountWithIntl(
    <TagDisplay
      tags={tags} />
  )

  t.truthy(wrapper.html().includes(tags[0].tag) && wrapper.html().includes(tags[1].tag))
})
