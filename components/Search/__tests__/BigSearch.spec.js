import React from 'react'
import test from 'ava'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'

import BigSearch from '../BigSearch'
import sinon from 'sinon'

// Suppress console warning messages from async validator as they mess up the test output
const orginalWarn = console.warn

test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    orginalWarn(...args)
  }
})

test.after.always(() => {
  console.warn = orginalWarn
})

test.serial('shallow render search', t => {
  const wrapper = shallowWithIntl(
    <BigSearch
      search='Test'
      onSearch={() => {}}
      locations={[]}
      onFilterChange={() => {}} />
  )
  t.true(wrapper.html().includes('Search'))
})

test.failing('filter is initially hidden and is shown when location clicked', t => {
  const wrapper = mountWithIntl(
    <BigSearch
      search='Test'
      onSearch={() => {}}
      locations={[]}
      onFilterChange={() => {}} />
  )

  t.is(wrapper.find('LocationSelector').length, 0)

  const filterItems = wrapper.find('a')
  filterItems.forEach(w => {
    if (w.html().includes('Location')) {
      w.simulate('click')
    }
  })

  t.is(wrapper.find('LocationSelector').length, 1)
})

test.failing('filter is hidden when cancel clicked', t => {
  const wrapper = mountWithIntl(
    <BigSearch
      search='Test'
      onSearch={() => {}}
      locations={[]}
      onFilterChange={() => {}} />
  )

  // ensure filter details showing
  wrapper.instance().setState({ filterShowing: true })
  wrapper.update()

  t.is(wrapper.find('LocationSelector').length, 1)

  // select cancel button
  wrapper.find('.filter-details-btn-container .ant-btn-secondary').simulate('click')

  t.is(wrapper.find('LocationSelector').length, 0)
})

test.serial('on search callback called when search is confirmed', t => {
  const onSearch = sinon.spy()
  const wrapper = mountWithIntl(
    <BigSearch
      search='Test'
      onSearch={onSearch}
      locations={[]}
      onFilterChange={() => {}} />
  )

  wrapper.find('.ant-input-search-button').first().simulate('click')

  t.truthy(onSearch.calledOnce)
  t.truthy(onSearch.calledWith('Test'))
})

test.failing('filter callback called when filter is changed', async t => {
  const filterChanged = sinon.spy()
  const wrapper = mountWithIntl(
    <BigSearch
      search='Test'
      onSearch={() => {}}
      locations={[]}
      onFilterChange={filterChanged} />
  )

  // ensure filter details showing
  wrapper.instance().setState({ filterShowing: true })
  wrapper.update()

  // select auckland
  wrapper.find('LocationSelector').first().props().onChange('Auckland')
  wrapper.update()

  // select filter button
  wrapper.find('.filter-details-btn-container .ant-btn-primary').simulate('click')

  t.truthy(filterChanged.calledOnce)
  t.truthy(filterChanged.calledWith('Auckland'))
})
