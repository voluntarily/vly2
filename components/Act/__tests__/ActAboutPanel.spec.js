import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import ActAboutPanel from '../ActAboutPanel'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import ops from '../../Op/__tests__/Op.fixture'

// Initial activities
const actMin = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  duration: '15 Minutes',
  location: 'Newmarket, Auckland',
  status: 'draft',
  tags: []
}

test.before('Setup fixtures', (t) => {
  t.context.mockStore = configureStore()(
    {
      session: {
        me: {
          role: ['volunteer']
        }
      },
      opportunities: {
        sync: true,
        syncing: false,
        loading: false,
        data: ops,
        request: null
      }
    }
  )
})

const actMax = {
  _id: '5cc903e5f94141437622cea7',
  name: 'herding cats',
  subtitle: 'can you train cats using lazers',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Probably not ok to do this',
  volunteers: 5,
  duration: '6 hours',
  space: '1 acre',
  location: 'Newmarket, Auckland',
  equipment: ['cats', 'lasers', 'buckets'],
  status: 'active',
  tags: ['algorithms', 'scheduling'],
  opCounts: { ask: 10, offer: 5 }
}

test('render the panel with short draft act', t => {
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <ActAboutPanel act={actMin} onPress={() => {}} />
    </Provider>
  )
  t.is(wrapper.find('h2').first().text(), 'About')
})

test('render the panel with full act', t => {
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <ActAboutPanel act={actMax} onPress={() => {}} />
    </Provider>)
  t.is(wrapper.find('h2').first().text(), 'About')
})

test('render the detail with no picture ', t => {
  const actNoPic = {
    _id: '5cc903e5f94141437622cea7',
    name: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    status: 'draft',
    tags: []
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <ActAboutPanel act={actNoPic} onPress={() => {}} />
    </Provider>
  )
  t.is(wrapper.find({ space: '1 acre' }).length, 0)
})
