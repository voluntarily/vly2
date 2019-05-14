import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import reduxApi, { transformers } from 'redux-api'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { connect } from 'react-redux'

// Collect here all Reducers outside of the api group.
import { ReduxStoreTestReducer } from '../../components/testredux/ReduxStoreTest'
import { HealthReducer } from '../../components/testredux/ReduxAsyncTest'

const { config } = require('../../config/config')

const apiTransformer = function (data, prevData, action) {
  const actionMethod = _.get(action, 'request.params.method')
  switch (actionMethod) {
    case 'POST':
      return [...prevData, data]
    case 'PUT':
      return prevData.map(oldData => oldData._id === data._id ? data : oldData)
    case 'DELETE':
      return _(prevData).filter(oldData => oldData._id === data._id ? undefined : oldData).compact().value()
    default:
      return transformers.array.call(this, data, prevData, action)
  }
}

// redux-api documentation: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md
const thisReduxApi = reduxApi({

  organisations: {
    url: '/api/organisations/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    options: config.jsonOptions,
    transformer: apiTransformer
  },
  opportunities: {
    url: '/api/opportunities/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    options: config.jsonOptions,
    transformer: apiTransformer
  },
  people: {
    url: '/api/people/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    options: config.jsonOptions,
    transformer: apiTransformer
  }
  // reducer (state, action) {
  //  console.log('reducer', action);
  //  return state;
  // },

  // postfetch: [
  //  function ({data, actions, dispatch, getState, request}) {
  //    console.log('postfetch', {data, actions, dispatch, getState, request});
  //    dispatch(actions.kittens.sync());
  //  }
  // ],
})
  .use('fetch', adapterFetch(fetch))
  .use('rootUrl', config.appUrl)

export default thisReduxApi

// add in any non api reducers here.
thisReduxApi.reducers.rst = ReduxStoreTestReducer
thisReduxApi.reducers.hlth = HealthReducer

const reducer = combineReducers(thisReduxApi.reducers)

const createStoreWithThunkMiddleware = composeWithDevTools(applyMiddleware(thunkMiddleware))(createStore)
export const makeStore = (reduxState, enhancer) => createStoreWithThunkMiddleware(reducer, reduxState)

// endpointNames: Use reduxApi endpoint names here
const mapStateToProps = (endpointNames, reduxState) => {
  let props = {}
  for (let i in endpointNames) {
    props[endpointNames[i]] = reduxState[endpointNames[i]]
    props[`${endpointNames[i]}Actions`] = thisReduxApi.actions[endpointNames[i]]
  }
  return props
}

export const withReduxEndpoints = (PageComponent, endpointNames) => connect(mapStateToProps.bind(undefined, endpointNames))(PageComponent)
// Define custom endpoints/providers here:
export const withOrgs = PageComponent => withReduxEndpoints(PageComponent, ['organisations'])
export const withOps = PageComponent => withReduxEndpoints(PageComponent, ['opportunities'])
export const withPeople = PageComponent => withReduxEndpoints(PageComponent, ['people'])
