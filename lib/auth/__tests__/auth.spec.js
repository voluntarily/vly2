import test from 'ava'
import fetchMock from 'fetch-mock'
import Cookie from 'js-cookie'
import sinon from 'sinon'
import { jwtData, jwtDataExpired } from '../../../server/middleware/session/__tests__/setSession.fixture'
import { getSession, isJwtExpValid, setToken, unsetToken } from '../auth'

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

test.serial('server side: getSession from req', async t => {
  const req = {
    session: {
      idToken: 'req idToken'
    }
  }
  const fakestore = {
    session: {
      idToken: 'store idToken',
      isAuthenticated: true,
      me: { name: 'testy', nickname: 'testy', roles: ['volunteer'] }
    }
  }
  const store = {
    dispatch: sinon.fake(),
    getState: sinon.fake.returns(fakestore)
  }
  const session = await getSession(req, store)
  t.is(session, req.session)
  t.true(store.dispatch.calledOnce)
})

test.serial('client side: getSession from store', async t => {
  const req = {
    // does not contain a session
  }
  const fakestore = {
    session: {
      idToken: 'store idToken',
      isAuthenticated: true,
      me: { name: 'testy', nickname: 'testy', roles: ['volunteer'] },
      user: jwtData.idTokenPayload
    }
  }
  const store = {
    dispatch: sinon.fake(),
    getState: sinon.fake.returns(fakestore)
  }
  const session = await getSession(req, store)
  t.is(session, fakestore.session)
  t.true(store.dispatch.notCalled)
})

test.serial('getSession redirects to sign-thru when JWT is expired', async t => {
  const req = {
    // does not contain a session
  }
  const fakestore = {
    session: {
      idToken: 'store idToken',
      isAuthenticated: true,
      me: { name: 'testy', nickname: 'testy', roles: ['volunteer'] },
      user: jwtDataExpired.idTokenPayload
    }
  }
  const store = {
    dispatch: sinon.fake(),
    getState: sinon.fake.returns(fakestore)
  }
  const windowReplaceFake = sinon.fake()

  const realWindow = global.window
  try {
    global.window = {
      location: {
        pathname: '/home',
        search: '?tab=history',
        hash: '',
        replace: windowReplaceFake
      }
    }

    await getSession(req, store)

    const expectedRedirectUrl = '/auth/sign-thru?redirect=%2Fhome%3Ftab%3Dhistory'

    const result = windowReplaceFake.calledWith(expectedRedirectUrl)
    t.true(result)
  } catch (e) {} finally {
    // reset global.window
    global.window = realWindow
    sinon.restore()
  }
})

test.serial('isJwtExpValid returns false on expired token', t => {
  const isActive = isJwtExpValid(jwtDataExpired.idTokenPayload.exp)
  t.false(isActive)
})

test.serial('isJwtExpValid returns true on active token', t => {
  const isActive = isJwtExpValid(jwtData.idTokenPayload.exp)
  t.true(isActive)
})
