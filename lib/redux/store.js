// store.js

import { createStore, applyMiddleware } from 'redux'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { combinedReducers } from './reduxApi'

export const HydratingReducer = (state = {}, action) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload }
    default:
      return combinedReducers(state, action)
  }
}

const initialState = { }
// create a makeStore function
const makeStore = context => createStore(
  HydratingReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
)

// export an assembled wrapper
export const reduxWrapper = createWrapper(makeStore, { debug: false })
