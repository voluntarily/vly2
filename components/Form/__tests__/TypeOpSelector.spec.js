import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import TypeOpSelector from '../Input/TypeOpSelector'
import sinon from 'sinon'
const originalWarn = console.warn

test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    originalWarn(...args)
  }
})

test.after.always(() => {
  console.warn = originalWarn
})

test('render the opportunity type selector component, with available option', t => {
  const opTypes = ['All', 'Ask', 'Offer']
  const mockOnChange = sinon.spy()

  const wrapper = mountWithIntl(
    <TypeOpSelector value='All' onChange={mockOnChange} opTypes={opTypes} width='100%' />
  )

  t.true(wrapper.html().includes('All'))
})

test('render the search input on change in opportunty type', t => {
  const inputSearch = 'Offer'
  const opTypes = ['All', 'Ask', 'Offer']
  const mockOnChange = sinon.spy()

  const wrapper = mountWithIntl(
    <TypeOpSelector value='All' onChange={mockOnChange} opTypes={opTypes} width='100%' />
  )

  wrapper.find('input').simulate('change', { target: { value: inputSearch } })

  const inputField = wrapper.find('input').first()
  t.true(inputField.html().includes('Offer'))
})
