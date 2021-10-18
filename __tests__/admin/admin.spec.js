import test from 'ava'
import sinon from 'sinon'
import fetchMock from 'fetch-mock'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import AdminPage from '../../pages/admin/index'
import GoalListPage from '../../pages/admin/goals'
import { mountWithIntl, shallowWithIntl } from '../../lib/react-intl-test-helper'
import goals from '../../server/api/goal/__tests__/goal.fixture'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import reduxApi from '../../lib/redux/reduxApi'
// import { loadInterestFixtures, clearInterestFixtures, sessions } from './invite-school.fixture'
// import SchoolLookUp from '../../server/api/school-lookup/school-lookup'

test.before('Setup fixtures', (t) => {
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer

  t.context.mockStore = configureStore([thunk])(
    {
      session: {
        isAuthenticated: true,
        user: { nickname: 'testy' }
      },
      goals: {
        sync: true,
        syncing: false,
        loading: false,
        data: goals,
        request: null
      }
    }
  )
})
test.afterEach.always(t => {
  t.context.mockServer.reset()
  sinon.restore()
})

// ADMIN Menu

test('shallow /admin for anonymous', async t => {
  const wrapper = shallowWithIntl(<AdminPage />)
  t.true(wrapper.exists('AccessDenied'))
})

test('shallow /admin for an admin', async t => {
  const wrapper = shallowWithIntl(<AdminPage isAdmin />)
  t.false(wrapper.exists('AccessDenied'))
  t.is(wrapper.find('h1').first().text(), 'Administration Tools')
})

test('shallow /admin/goals for anonymous', async t => {
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <GoalListPage />
    </Provider>
  )
  t.true(wrapper.exists('AccessDenied'))
})

// // GOALS

test('shallow /admin/goals for admin', async t => {
  t.context.mockServer
    .get('path:/api/goals/', { body: goals })
  reduxApi.use('fetch', adapterFetch(t.context.mockServer))

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <GoalListPage isAdmin />
    </Provider>
  )
  t.false(wrapper.exists('AccessDenied'))
  t.true(wrapper.exists('GoalListPage'))
  t.is(wrapper.find('GoalCard').length, 6)
  t.true(t.context.mockServer.done())
})

// // INVITE-SCHOOL
// test.serial('Load invite school page as admin', async (t) => {
//   t.context.mockServer.get(
//     'end:/api/schools?p=schoolId%20name',
//     { body: await SchoolLookUp.find() }
//   )

//   const response = await request(server)
//     .get('/admin/invite-school')
//     .set('Cookie', [`idToken=${sessions[0].idToken}`])

//   t.is(response.status, 200, 'Should be allowed to view page')
// })

// test.serial('Load invite school page as anon', async (t) => {
//   t.context.mockServer.get(
//     'end:/api/schools?p=schoolId%20name',
//     { status: 403 }
//   )

//   const response = await request(server)
//     .get('/admin/invite-school')
//   t.is(response.status, 302, 'Should be redirected to login')
// })

// test.serial('Load invite school page as authenticated', async (t) => {
//   t.context.mockServer.get(
//     'end:/api/schools?p=schoolId%20name',
//     { status: 403 }
//   )

//   const response = await request(server)
//     .get('/admin/invite-school')
//     .set('Cookie', [`idToken=${sessions[1].idToken}`])

//   t.truthy(response.text.includes('<h1>Access denied</h1><p>You do not have permission to view this page.</p>'))
// })

// // TEST
// test.serial('Load admin/test page as admin', async (t) => {
//   const response = await request(server)
//     .get('/admin/test')
//     .set('Cookie', [`idToken=${sessions[0].idToken}`])

//   t.is(response.status, 200, 'Should be allowed to view page')
// })
