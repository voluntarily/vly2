import test from 'ava'
import React from 'react'
import FileUpload from '../FileUpload'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

test('mount FileUpload', t => {
    const wrapper = mountWithIntl(
      <FileUpload />
    )
  
    t.truthy(wrapper.find('Uppy').first())
  })
  