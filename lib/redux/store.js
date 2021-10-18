// store.js

import { createStore, applyMiddleware } from 'redux'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { combinedReducers } from './reduxApi'

export const HydratingReducer = (state = {}, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload // apply delta from hydration
    }
    return nextState
  } else {
    return combinedReducers(state, action)
  }
}

const initialState = { }
// create a makeStore function
export const makeStore = context => createStore(
  HydratingReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
)

// Use this when you want to init the store during testing
export const makeStoreTest = init => createStore(
  HydratingReducer,
  init,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
)

// export an assembled wrapper
export const reduxWrapper = createWrapper(makeStore, { debug: false })
export default reduxWrapper
