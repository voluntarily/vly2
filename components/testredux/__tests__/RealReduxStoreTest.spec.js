import test from 'ava'
import ReduxStoreTest, { setName, ReduxStoreTestReducer } from '../ReduxStoreTest'
import { mount } from 'enzyme'

import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

/*
  Same as for LocalStateTest
  Test that the component
  - renders properly
  - input text into the field
  - updates the redux store
  - result appears in the output

  but this will fail unless we have not provide a redux store.
  'Could not find "store" in the context of "Connect(ReduxStoreTest)".
  Either wrap the root component in a <Provider>,
  or pass a custom React context provider to <Provider> and the corresponding
  React context consumer to Connect(ReduxStoreTest) in connect options.',
*/

/*
 initial store should have the shape of the result we want as an INIT action
  won't have been called.
  mockStore also will receive the actions but won't call the reducers so the final
  state doesn't update.
*/
const rstReducer = combineReducers({ rst: ReduxStoreTestReducer })
const uiReducer = combineReducers({ ui: rstReducer })
const realStore = createStore(uiReducer,
  {
    ui: {
      rst: {
        name: ''
      }
    }
  }
)

test('mount, render add input and save', t => {
  const wrapper = mount(
    <Provider store={realStore}>
      <ReduxStoreTest />
    </Provider>
  )

  t.truthy(wrapper.find('Hello[name="World"]').first())
  t.truthy(wrapper.find('input#editname').first().exists())

  // push text into the input field and trigger onChange event.
  wrapper.find('input#editname').first()
    .simulate('change', { target: { name: 'editname', value: 'Andrew' } })

  // state debug section should show text in the editname.
  t.truthy(wrapper.find('code').first().text(), '{"editname":"Andrew","savedname":"World"}')

  // now click the save button.
  wrapper.find('button').first().simulate('click')
  // console.log(realStore.getState())
  t.is(realStore.getState().ui.rst.name, 'Andrew')
  // Hello class updates with the new text
  wrapper.update()
  // console.log(wrapper.html())
  t.is(wrapper.find('h2').text(), 'Hello, Andrew')
})

test('reducer', t => {
  // undefined store returns initial state
  const init = ReduxStoreTestReducer(undefined, {})
  t.deepEqual(init, { name: '' })

  const action = setName('Murgatroyd Finlayson')
  const newstate = ReduxStoreTestReducer(init, action)
  t.deepEqual(newstate, { name: 'Murgatroyd Finlayson' })
})
