import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import TypeFilter from '../TypeFilter'
import sinon from 'sinon'

test('render the opportunity type selector modal', t => {
  const opTypes = ['All', 'Ask', 'Offer']
  const mockOnChange = sinon.spy()

  const wrapper = mountWithIntl(
    <TypeFilter value='All' opTypes={opTypes} onChange={mockOnChange} />
  )

  t.true(wrapper.html().includes('All'))
  t.true(wrapper.exists('TypeFilter__TypeFilterContainer'))
})

test('render the search input on change in opportunty type', t => {
  const inputSearch = 'Offer'
  const opTypes = ['All', 'Ask', 'Offer']
  const mockOnChange = sinon.spy()

  const wrapper = mountWithIntl(
    <TypeFilter value='All' onChange={mockOnChange} opTypes={opTypes} />
  )

  wrapper.find('input').simulate('change', { target: { value: inputSearch } })

  const inputField = wrapper.find('input').first()
  t.true(inputField.html().includes('Offer'))
})
