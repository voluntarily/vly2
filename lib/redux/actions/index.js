export const SET_SESSION = 'SET_SESSION'

export const setSession = session => {
  return {
    type: SET_SESSION,
    ...session
  }
}
