import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { ItemVolunteers } from '../../VTheme/ItemList'
import ActDetail from '../ActDetail'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

// Initial activities
const actMin = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  location: 'Newmarket, Auckland',
  status: 'draft',
  tags: []
}

const mockStore = configureStore()(
  {
    session: {
      me: {
        role: ['volunteer']
      }
    }
  }
)

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
  tags: ['algorithms', 'scheduling']
}

test('render the detail with short draft act', t => {
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <ActDetail act={actMin} onPress={() => {}} />
    </Provider>
  )
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), `Draft: ${actMin.name}`)
  t.is(wrapper.find({ duration: actMin.duration }).length, 1)
  t.is(wrapper.find('li').length, 4) // only minimal items shown
})

test('render the detail with full act', t => {
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <ActDetail act={actMax} onPress={() => {}} />
    </Provider>)
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), actMax.name)
  t.is(wrapper.find({ space: actMax.space }).length, 1)
  t.is(wrapper.find({ volunteers: actMax.volunteers }).length, 2)
  t.is(wrapper.find('li').length, 10)
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
    <Provider store={mockStore}>
      <ActDetail act={actNoPic} onPress={() => {}} />
    </Provider>
  )
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find({ space: '1 acre' }).length, 0)
  t.is(wrapper.find('li').length, 4)
})

test('render Volunteers per student properly if the value is < 1', t => {
  const wrapper = mountWithIntl(<ItemVolunteers volunteers={0.2} type='act' />)
  t.is(wrapper.text(), '🙋 Volunteers per student:5')
})

test('render documents on activity form', t => {
  const act = {
    _id: '5cc903e5f94141437622cea7',
    name: 'herding cats',
    subtitle: 'can you train cats using lazers',
    description: 'Probably not ok to do this',
    status: 'active',
    documents: [{
      filename: 'abc.pdf',
      location: 'https://amazon.com/abc.pdf'
    },
    {
      filename: 'xyz.pdf',
      location: 'https://amazon.com/xyz.pdf'
    }]
  }

  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <ActDetail act={act} />
    </Provider>)
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('#documents li').length, 2)
})
