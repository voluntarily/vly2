import test from 'ava'
import jwtDecode from 'jwt-decode'
import people from '../../../server/api/person/__tests__/person.fixture'
import { jwtData, jwtDataExpired, jwtDataBob, DEFAULT_SESSION } from '../../../server/middleware/session/__tests__/setSession.fixture'
import {
  setToken,
  unsetToken,
  getPersonFromUser,
  getSessionFromCookies,
  getSession,
  isJwtExpValid
} from '../auth'
import Cookie from 'js-cookie'
import fetchMock from 'fetch-mock'
import sinon from 'sinon'

test.beforeEach(t => {
  // t.context.mockServer = fetchMock.sandbox()
  // global.fetch = t.context.mockServer
  t.context.cls = console.error
  console.error = sinon.spy()
})

test.afterEach(t => {
  fetchMock.reset()
  console.error = t.context.cls
})

test.serial('setToken writes cookies, unset clears', t => {
  setToken('idToken1234', 'accessToken5678')
  t.is(Cookie.get('idToken'), 'idToken1234')
  t.is(Cookie.get('accessToken'), 'accessToken5678')

  unsetToken()
  t.is(Cookie.get('idToken'), undefined)
})

test.serial('convert user to person when person exists', async t => {
  fetchMock.get('path:/api/people/', people[0])
  const user = jwtDecode(jwtData.idToken)
  const person = await getPersonFromUser(user)
  t.is(person.email, jwtData.idTokenPayload.email)
  fetchMock.restore()
})

test.serial('person look up fails', async t => {
  fetchMock.get('path:/api/people/', 404)
  const user = jwtDecode(jwtData.idToken)
  const person = await getPersonFromUser(user)
  t.false(person)
  fetchMock.restore()
})

test.serial('getSessionFromCookies', async t => {
  unsetToken()
  let session = await getSessionFromCookies()
  t.deepEqual(session, DEFAULT_SESSION)

  // bob has valid idToken but is email unverified, so should not be authenticated
  setToken(jwtDataBob.idToken, 'accessToken5678')
  session = await getSessionFromCookies()
  t.false(session.isAuthenticated)
  t.is(session.user.email, jwtDataBob.idTokenPayload.email)
  t.is(session.me.name, undefined)

  setToken(jwtData.idToken, 'accessToken5678')
  fetchMock.get('path:/api/people/', people[0])
  session = await getSessionFromCookies()
  t.is(session.me.email, jwtData.idTokenPayload.email)
  fetchMock.restore()
})

test.serial('getSession from req', async t => {
  const req = {
    session: {
      idToken: 'does not matter'
    }
  }
  const store = {
    dispatch: sinon.fake()
  }
  const session = await getSession(req, store)
  t.is(session, req.session)
  t.true(store.dispatch.calledOnce)
})

test.serial('getSession from cookies', async t => {
  const req = { }
  const store = {
    dispatch: sinon.fake()
  }
  setToken(jwtData.idToken, 'accessToken5678')
  fetchMock.get('path:/api/people/', people[0])
  const session = await getSession(req, store)
  t.is(session.me.email, jwtData.idTokenPayload.email)
  t.true(store.dispatch.calledOnce)

  fetchMock.restore()
})

test.serial('getSession redirects to sign-thru when JWT is expired', async t => {
  const req = { }
  const store = {
    dispatch: sinon.fake()
  }

  const fakeLocationReplace = sinon.fake()

  const realWindow = global.window
  // mock global window object
  global.window = {
    location: {
      protocol: 'https:',
      host: 'beta.voluntarily.nz',
      pathName: '/home',
      search: '?tab=history',
      hash: '',
      replace: fakeLocationReplace
    }
  }

  // set expired jwt token
  setToken(jwtDataExpired.idToken, 'accessToken5678')
  await getSession(req, store)

  const expectedRedirectUrl = 'https://beta.voluntarily.nz/auth/sign-thru?redirect=%2Fhome%3Ftab%3Dhistory'

  const result = fakeLocationReplace.calledWith(expectedRedirectUrl)
  t.true(result)

  // reset global.window
  global.window = realWindow
})

test.serial('isJwtExpValid returns false on expired token', t => {
  console.log(global.window)
  const isActive = isJwtExpValid(jwtDataExpired.idTokenPayload.exp)
  t.false(isActive)
})

test.serial('isJwtExpValid returns true on active token', t => {
  const isActive = isJwtExpValid(jwtData.idTokenPayload.exp)
  t.true(isActive)
})
