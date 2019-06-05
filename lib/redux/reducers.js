import * as ACTIONS from './actions'

const sessionInitialState = {
  isAuthenticated: false,
  user: {},
  me: {}
}

export const SessionReducer = (state = sessionInitialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SESSION:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        user: action.user,
        me: action.me
      }
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
