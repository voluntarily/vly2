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

// const expectedHealth = {
//   message: 'Hello from Voluntari.ly V0.0.2',
//   health: 'OK'
// }

const reducers = combineReducers({
  health: HealthReducer,
  rst: ReduxStoreTestReducer
})

const initStore = {
  health: initHealth,
  rst: { name: 'World' }
}
const realStore = createStore(reducers, initStore, applyMiddleware(thunk))

test('api/health', async t => {
  const expectedHealth = {
    message: 'Hello from Voluntari.ly V0.0.2',
    health: 'OK'
  }

  fetchMock.getOnce(`${API_URL}/health`, expectedHealth)

  // undefined store returns initial state
  const init = HealthReducer(undefined, {})
  t.deepEqual(init, initHealth)

  await fetchHealth()(realStore.dispatch)
  const newstate = await realStore.getState().health
  t.deepEqual(newstate, expectedHealth)
  fetchMock.restore()
})

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test.only('mount, render add input and save', async t => {
  const expectedHealth = {
    message: 'Hello from Voluntari.ly V0.0.2',
    health: 'OK'
  }

  fetchMock.getOnce(`${API_URL}/health`, expectedHealth)

  const wrapper = mount(
    <Provider store={realStore}>
      <ReduxAsyncTest />
    </Provider>
  )
  // console.log('realstore state', realStore.getState())
  t.is(realStore.getState().health.health, 'Unknown')
  // now click the save button.
  await wrapper
    .find('button')
    .first()
    .simulate('click')

  // TODO find out how to wait for the callback on the click handler to complete,
  await sleep(10)
  // console.log(await realStore.getState())
  t.is(await realStore.getState().health.health, 'OK')
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
