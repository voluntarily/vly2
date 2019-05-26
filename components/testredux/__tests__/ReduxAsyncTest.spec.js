import test from 'ava'
import ReduxAsyncTest, { fetchHealth, HealthReducer } from '../ReduxAsyncTest'
import { mount } from 'enzyme'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import fetchMock from 'fetch-mock'
import { API_URL } from '../../../lib/apiCaller'

import { ReduxStoreTestReducer } from '../ReduxStoreTest'
/*
 initial store should have the shape of the result we want as an INIT action
  won't have been called.
  mockStore also will receive the actions but won't call the reducers so the final
  state doesn't update.
*/

const initHealth = {
  message: 'Pending',
  health: 'Unknown'
}

const expectedHealth = {
  message: 'Hello from Voluntari.ly V0.0.2',
  health: 'OK'
}

const reducers = combineReducers({
  health: HealthReducer,
  rst: ReduxStoreTestReducer
})

const initStore = {
  health: initHealth,
  rst: { name: 'World' }
}

test.beforeEach('create a store', async t => {
  // console.log('creating people')
  t.context.realStore = createStore(reducers, initStore, applyMiddleware(thunk))
  // console.log('creating people done')
})

test.afterEach.always(async t => {
  t.context.realStore = null
})

test.serial('api/health', async t => {
  // undefined store returns initial state
  fetchMock.get(`${API_URL}/health`, expectedHealth)

  const init = HealthReducer(undefined, {})
  t.deepEqual(init, initHealth)

  await fetchHealth()(t.context.realStore.dispatch)
  const newstate = await t.context.realStore.getState().health
  t.deepEqual(newstate, expectedHealth)
  fetchMock.restore()
})

test.serial('bad api/health', async t => {
  // undefined store returns initial state
  fetchMock.get(`${API_URL}/health`, 404)

  const expectedBadHealth = {
    message: 'Hello from Voluntari.ly V0.0.2',
    health: 'Not OK'
  }

  await fetchHealth()(t.context.realStore.dispatch)
  const newstate = await t.context.realStore.getState().health
  t.deepEqual(newstate, expectedBadHealth)
  fetchMock.restore()
})

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test.serial('mount, render add input and save', async t => {
  fetchMock.getOnce(`${API_URL}/health`, expectedHealth)

  const wrapper = mount(
    <Provider store={t.context.realStore}>
      <ReduxAsyncTest />
    </Provider>
  )
  // console.log('realstore state', realStore.getState())
  t.is(t.context.realStore.getState().health.health, 'Unknown')
  // now click the save button.
  await wrapper
    .find('button')
    .first()
    .simulate('click')

  // TODO find out how to wait for the callback on the click handler to complete,
  await sleep(10)
  // console.log(await realStore.getState())
  t.is(await t.context.realStore.getState().health.health, 'OK')
  // Hello class updates with the new text
  wrapper.update()

  // console.log(wrapper.html())
  t.is(
    wrapper
      .find('p')
      .first()
      .text(),
    'Hi World'
  )
  t.is(
    wrapper
      .find('p')
      .at(1)
      .text(),
    'Health is OK'
  )
  fetchMock.restore()
})
