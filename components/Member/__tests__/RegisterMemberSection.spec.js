import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import RegisterMemberSection from '../RegisterMemberSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'

import { API_URL } from '../../../lib/apiCaller'
import fixture from './member.fixture.js'
import { MemberStatus } from '../../../server/api/member/member.constants'

test.before('Setup fixtures', fixture)

const { fetchMock } = require('fetch-mock')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const initStore = t => {
  return ({
    organisations: {
      loading: false,
      data: t.context.orgs
    },
    members: {
      loading: false,
      data: []
    }
  })
}

test.serial('mount RegisterMemberSection with with no existing member', async t => {
  //   console.log(people[0])
  const orgid = t.context.organisations[1]._id
  const meid = t.context.me._id
  const realStore = makeStore(initStore(t))
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const getmymembers = `${API_URL}/members/?org=${orgid}&me=${meid}`
  myMock.getOnce(getmymembers, [])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <RegisterMemberSection
        org={orgid}
        meID={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  t.is(wrapper.find('.loader').first().text(), 'Loading...')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "i'm membered"
  t.is(wrapper.find('button').first().text(), "I'm Membered")
  wrapper.find('button').first().simulate('click')
  t.is(wrapper.find('h1').first().text(), 'How do you want to get involved?')

  const postnewmember = `${API_URL}/members/`
  myMock.postOnce(postnewmember, members[0])

  // fill in validation on input field
  const validation = wrapper.find('#register_member_form_validation').first()
  validation.simulate('change', { target: { value: 'Test mount RegisterMemberSection with with no existing member' } })
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('h1').first().text(), 'Thank you for expressing your member!')

  // press Get Involved! button
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('mount RegisterMemberSection with op and me', async t => {
  //   console.log(people[0])
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const getmymembers = `${API_URL}/members/?op=${orgid}&me=${meid}`
  myMock.getOnce(getmymembers, members[0])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <RegisterMemberSection
        op={orgid}
        meID={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  t.is(wrapper.find('.loader').first().text(), 'Loading...')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // once loading completed should the thank you note
  t.is(wrapper.find('h1').first().text(), 'Thank you for expressing your member!')
  t.truthy(myMock.done())
  myMock.restore()
})

// showing status
