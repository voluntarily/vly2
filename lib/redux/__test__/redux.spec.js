import test from 'ava'
import { actionTest, reducerTest } from 'redux-ava'

import { setSession, setRouting } from '../actions'
import { SessionReducer, RoutingReducer } from '../reducers'

// With single parameter
const sessionInitialState = {
  isAuthenticated: false,
  user: {},
  me: {}
}

const session = {
  isAuthenticated: true,
  user: { nickname: 'testy' },
  me: { name: 'Testy McTestface' }
}

test('setSession action', actionTest(setSession, session, { type: 'SET_SESSION', ...session }))

const routingInitialState = {
  redirectUrl: '/home'
}
const routing = {
  redirectUrl: 'http://example.com/redirect'
}

test('setRouting action', actionTest(setRouting, routing, { type: 'SET_ROUTING', ...routing }))

test('SessionReducer reducer handles setSession', reducerTest(
  SessionReducer,
  sessionInitialState,
  setSession(session),
  { ...session }
))

test('SessionReducer reducer handles setRouting', reducerTest(
  SessionReducer,
  sessionInitialState,
  setRouting(routing), // sic test with a different action
  sessionInitialState
))

test('RoutingReducer reducer handles setRouting', reducerTest(
  RoutingReducer,
  { redirectUrl: null },
  setRouting(routing),
  { ...routing }
))

test('RoutingReducer reducer handles setSession', reducerTest(
  RoutingReducer,
  routingInitialState,
  setSession(session), // sic test with a different action
  routingInitialState
))

test('Reducers handle initial state', t => {
  const sessionstate = SessionReducer(undefined, { action: 'INIT' })
  t.deepEqual(sessionstate, sessionInitialState)

  const routingstate = RoutingReducer(undefined, { action: 'INIT' })
  t.deepEqual(routingstate, routingInitialState)
})
