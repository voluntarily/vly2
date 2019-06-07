export const SET_SESSION = 'SET_SESSION'

export const setSession = session => {
  return {
    type: SET_SESSION,
    ...session
  }
}

export const SET_ROUTING = 'SET_ROUTING'

export const setRouting = routing => {
  return {
    type: SET_ROUTING,
    ...routing
  }
}
