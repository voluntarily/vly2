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

const { config } = require('../../config/clientConfig')

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
    transformer: apiTransformer
  },
  opportunities: {
    url: '/api/opportunities/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  archivedOpportunities: {
    url: '/api/archivedOpportunities/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  recommendedOps: {
    url: '/api/opportunities/recommended',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  activities: {
    url: '/api/activities/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  people: {
    url: '/api/people/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  interests: {
    url: '/api/interests/(:id)',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  interestArchives: {
    url: '/api/interestArchives/(:id)',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  members: {
    url: '/api/members/(:id)',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  tags: {
    url: '/api/tags/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  locations: {
    url: '/api/locations',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  goals: {
    url: '/api/goals/(:id)',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud

    transformer: apiTransformer
  },
  personalGoals: {
    url: '/api/personalGoals/(:id)',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  stories: {
    url: '/api/stories/(:id)',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  },
  feedback: {
    url: '/api/feedback/(:id)',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
    transformer: apiTransformer
  }
})
  .use('fetch', adapterFetch(fetch))
  .use('rootUrl', config.appUrl)
  .use('options', (url, params, getState) => {
    const options = { ...config.jsonOptions }
    const idToken = getState().session.idToken
    if (idToken) {
      options.headers.authorization = `Bearer ${idToken}`
    }
    return options
  })
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
  const props = {}
  for (const i in endpointNames) {
    props[endpointNames[i]] = reduxState[endpointNames[i]]
    props[`${endpointNames[i]}Actions`] = thisReduxApi.actions[endpointNames[i]]
  }
  return props
}

export const withReduxEndpoints = (PageComponent, endpointNames) => connect(mapStateToProps.bind(undefined, endpointNames))(PageComponent)
// Define custom endpoints/providers here:
export const withOrgs = PageComponent => withReduxEndpoints(PageComponent, ['organisations', 'members', 'tags'])
export const withActs = PageComponent => withReduxEndpoints(PageComponent, ['activities', 'tags'])
export const withOps = PageComponent => withReduxEndpoints(PageComponent, ['opportunities', 'tags', 'locations', 'activities'])
export const withLocations = PageComponent => withReduxEndpoints(PageComponent, ['locations'])
export const withPeople = PageComponent => withReduxEndpoints(PageComponent, ['people', 'tags'])
export const withInterests = PageComponent => withReduxEndpoints(PageComponent, ['interests'])
export const withMembers = PageComponent => withReduxEndpoints(PageComponent, ['members'])
export const withArchivedOpportunities = PageComponent => withReduxEndpoints(PageComponent, ['archivedOpportunities', 'tags', 'locations'])
export const withInterestsArchived = PageComponent => withReduxEndpoints(PageComponent, ['interestArchives'])
export const withRecommendedOps = PageComponent => withReduxEndpoints(PageComponent, ['recommendedOps'])
export const withGoals = PageComponent => withReduxEndpoints(PageComponent, ['goals'])
export const withPersonalGoals = PageComponent => withReduxEndpoints(PageComponent, ['personalGoals'])
export const withHomeData = PageComponent => withReduxEndpoints(PageComponent, ['opportunities', 'archivedOpportunities', 'recommendedOps', 'interests', 'members', 'tags', 'locations', 'activities', 'personalGoals', 'interestArchives'])
export const withStories = PageComponent => withReduxEndpoints(PageComponent, ['stories'])
export const withFeedback = PageComponent => withReduxEndpoints(PageComponent, ['feedback'])
