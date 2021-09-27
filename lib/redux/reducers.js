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
      // TODO: find neater way to make the me JSON compatable.
      if (action.isAuthenticated) {
        if (action.me.verified) {
          delete action.me.verified[0]._id
          delete action.me.verified[0].createdAt
          delete action.me.verified[0].updatedAt
        }
        action.me._id = action.me._id?.toString()
        action.me.createdAt = action.me.createdAt.toString()
        action.me.updatedAt = action.me.updatedAt.toString()
      }
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        user: action.user,
        me: action.me,
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
