import * as ACTIONS from './actions'

const sessionInitialState = {
  isAuthenticated: false,
  user: {},
  me: {},
  idToken: ''
}

export const SessionReducer = (state = sessionInitialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SESSION:
    {
      // ensure objects are serialisable
      const me = JSON.parse(JSON.stringify(action.me))

      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        user: action.user,
        me,
        idToken: action.idToken
      } }
    default:
      return state
  }
}

const routingInitialState = {
  redirectUrl: '/home'
}

export const RoutingReducer = (state = routingInitialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_ROUTING:
      return {
        ...state,
        redirectUrl: action.redirectUrl
      }
    default:
      return state
  }
}
