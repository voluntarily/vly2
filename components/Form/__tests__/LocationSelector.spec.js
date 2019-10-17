import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import LocationSelector from '../Input/LocationSelector'
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

test('render the location component, with pre-existing location', t => {
  const existingLocations = ['Auckland', 'Christchurch', 'Wellington', 'Whangarei']
  const mockOnChange = sinon.spy()

  const wrapper = mountWithIntl(
    <LocationSelector value={'Auckland'} onChange={mockOnChange} existingLocations={existingLocations} />
  )

  t.true(wrapper.html().includes('Auckland'))
})

test('render the location component, with an example input search', t => {
  const existingLocations = ['Auckland', 'Christchurch', 'Wellington', 'Whangarei']
  const inputSearch = 'Auck'
  const mockOnChange = sinon.spy()

  const wrapper = mountWithIntl(
    <LocationSelector value={'Auckland'} onChange={mockOnChange} existingLocations={existingLocations} />
  )

  wrapper.find('input').simulate('change', { target: { value: inputSearch } })

  const inputField = wrapper.find('input').first()
  t.true(inputField.html().includes('Auck'))
})
