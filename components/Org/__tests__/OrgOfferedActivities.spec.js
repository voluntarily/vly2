import test from 'ava'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { mountWithIntl, mountWithMockIntl } from '../../../lib/react-intl-test-helper'
import { Provider } from 'react-redux'
import fetchMock from 'fetch-mock'
import reduxApi from '../../../lib/redux/reduxApi'
import { makeStore } from '../../../lib/redux/store'
import { OrgOfferedActivities } from '../OrgOfferedActivities'

test('No results', async t => {
  const expectedNotFoundMessage = 'No offered activities found yet'
  const store = makeStore({})
  const myMock = fetchMock.sandbox()

  myMock
    .getOnce('path:/api/activities/', { body: [] })

  reduxApi.use('fetch', adapterFetch(myMock))

  const wrapper = mountWithMockIntl(
    <Provider store={store}>
      <OrgOfferedActivities organisationId='testorg' />
    </Provider>,
    {
      'orgTabs.offers.activities.notfound': expectedNotFoundMessage
    }
  )

  await myMock.flush(true)
  wrapper.update()

  const actualNotFoundMessage = wrapper.find('p').text()

  t.is(actualNotFoundMessage, expectedNotFoundMessage)
})

test('Results', async t => {
  const store = makeStore({})
  const myMock = fetchMock.sandbox()

  const results = [{
    _id: '5e7b1476ffa9a1c3e3d71895',
    imgUrl: '/static/img/activity/activity.png',
    status: 'active',
    name: 'My Test Activity',
    subtitle: 'asgfasfdgasdf',
    duration: '3 hours',
    offerOrg: '5e7861fa8a83596edbc739aa',
    slug: 'my-test-activity',
    opCounts: {
      ask: 0,
      offer: 0
    }
  }]

  myMock
    .getOnce('path:/api/activities/', { body: results })

  reduxApi.use('fetch', adapterFetch(myMock))

  const wrapper = mountWithIntl(
    <Provider store={store}>
      <OrgOfferedActivities organisationId='testorg' />
    </Provider>
  )

  await myMock.flush(true)
  wrapper.update()

  t.is(wrapper.find('ActCard').length, results.length)
})
