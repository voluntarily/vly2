import test from 'ava'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { mountWithIntl, mountWithMockIntl } from '../../../lib/react-intl-test-helper'
import { Provider } from 'react-redux'
import fetchMock from 'fetch-mock'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import { OrgOfferedOpportunities } from '../OrgOfferedOpportunities'
import { OrganisationRole } from '../../../server/api/organisation/organisation.constants'

test('No results', async t => {
  const expectedNotFoundMessage = 'No offered opportunities found yet'
  const store = makeStore({})
  const myMock = fetchMock.sandbox()

  myMock
    .getOnce('path:/api/opportunities/', { body: [] })

  reduxApi.use('fetch', adapterFetch(myMock))

  const wrapper = mountWithMockIntl(
    <Provider store={store}>
      <OrgOfferedOpportunities organisationId='testorg' />
    </Provider>,
    {
      'orgTabs.offers.opportunities.notfound': expectedNotFoundMessage
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
    _id: '5e7b187fffa9a1c3e3d71896',
    type: 'offer',
    name: 'Going to the supermarket',
    subtitle: 'This is my offer',
    imgUrl: '/static/img/opportunity/opportunity.png',
    status: 'active',
    date: [
      '2020-03-26T08:38:12.297Z',
      '2020-03-28T08:38:15.811Z'
    ],
    location: 'Online',
    duration: '5 min',
    offerOrg: {
      imgUrl: '/static/img/organisation/organisation.png',
      role: [
        OrganisationRole.VOLUNTEER_PROVIDER,
        OrganisationRole.OPPORTUNITY_PROVIDER,
        OrganisationRole.ACTIVITY_PROVIDER,
        OrganisationRole.ADMIN,
        'other'
      ],
      _id: '5e7861fa8a83596edbc739aa',
      name: 'Mitchs test'
    }
  }]

  myMock
    .getOnce('path:/api/opportunities/', { body: results })

  reduxApi.use('fetch', adapterFetch(myMock))

  const wrapper = mountWithIntl(
    <Provider store={store}>
      <OrgOfferedOpportunities organisationId='testorg' />
    </Provider>
  )

  await myMock.flush(true)
  wrapper.update()

  t.is(wrapper.find('OpCard').length, results.length)
})
