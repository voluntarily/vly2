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
import { SessionReducer, RoutingReducer } from '../redux/reducers'

const { config } = require('../../config/config')

const apiTransformer = function (data, prevData, action) {
  const actionMethod = _.get(action, 'request.params.method')
  switch (actionMethod) {
    case 'POST':
      if (Array.isArray(data)) {
        // allows post requests to include multiple items
        return [...prevData, ...data]
      } else {
        return [...prevData, data]
      }
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
  opportunityArchives: {
    url: '/api/opportunityArchives/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    options: config.jsonOptions,
    transformer: apiTransformer
  },
  activities: {
    url: '/api/activities/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    options: config.jsonOptions,
    transformer: apiTransformer
  },
  people: {
    url: '/api/people/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    options: config.jsonOptions,
    transformer: apiTransformer
  },
  interests: {
    url: '/api/interests/(:id)',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    options: config.jsonOptions,
    transformer: apiTransformer
  },
  tags: {
    url: '/api/tags/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    options: config.jsonOptions,
    transformer: apiTransformer
  },
  locations: {
    url: '/api/locations',
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
thisReduxApi.reducers.health = HealthReducer
thisReduxApi.reducers.session = SessionReducer
thisReduxApi.reducers.routing = RoutingReducer

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
export const withActs = PageComponent => withReduxEndpoints(PageComponent, ['activities', 'tags'])
export const withOps = PageComponent => withReduxEndpoints(PageComponent, ['opportunities', 'tags', 'locations'])
export const withLocations = PageComponent => withReduxEndpoints(PageComponent, ['locations'])
export const withPeople = PageComponent => withReduxEndpoints(PageComponent, ['people'])
export const withInterests = PageComponent => withReduxEndpoints(PageComponent, ['interests'])
export const withOpportunityArchives = PageComponent => withReduxEndpoints(PageComponent, ['opportunityArchives'])
