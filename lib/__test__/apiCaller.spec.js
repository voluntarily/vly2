import test from 'ava'
import 'isomorphic-fetch'
import callApi, { API_URL, convertCookiesToKvps } from '../apiCaller'
// import sinon from 'sinon'

const { fetchMock } = require('fetch-mock')
// test('fetchMock works', async t => {
// const health = {
//   message: 'Hello',
//   health: 'OK'
// }
//   fetchMock.getOnce('http://localhost:3122/api/health', health)

//   // eslint-disable-next-line no-use-before-define
//   const res = await fetch('http://localhost:3122/api/health')
//   const json = await res.json()
//   t.is(res.ok, true)
//   t.is(res.status, 200)
//   t.is(json.health, 'OK')
//   fetchMock.restore()
// })

test('API_URL', async t => {
  t.is(API_URL, `http://localhost:${process.env.PORT}/api`)
})

test('getAPI ', async t => {
  const expectedHealth = {
    message: 'Hello from Voluntari.ly V0.0.2',
    health: 'OK'
  }

  fetchMock.getOnce(`${API_URL}/health`, expectedHealth)
  const json = await callApi('health')
  t.is(json.health, 'OK')
  fetchMock.restore()
})

// test.only('getAPI handles data errors', async t => {

//   fetchMock.getOnce(`${API_URL}/nothere`, { status: 404, body: { message: 'These are not the pages you are looking for' } } )
//   const error = await t.throwsAsync( () => callApi('nothere'), {is: 'These are not the pages you are looking for'})
//   t.is(error.message, 'These are not the pages you are looking for')
// })

test('When server returns 500 status code then Promise should be rejected', async t => {
  try {
    fetchMock.getOnce(`*`, 500)
    await t.throwsAsync(() => callApi('health'), 'Internal Server Error')
  } catch (err) {
    console.log(err)
  }
})

test('When server throws an error then Promise should be rejected', async t => {
  try {
    fetchMock.restore()
    fetchMock.getOnce(`${API_URL}/health`, Promise.reject(new Error('foo')))
    await t.throwsAsync(() => callApi('health'), 'foo')
  } catch (err) {
    console.log(err)
  }
})

/*
test.only('throws an error if empty object', async t => {
   fetchMock.getOnce(`*`, 500)
  const onResponse =  sinon.spy()
  const onError =  sinon.spy()

  return  callApi('health')
    .then(onResponse)
    .catch(onError)
    .finally(() => {
        t.truthy(onResponse.notCalled)
  t.truthy(onError.calledOnce)
    });
});
*/
test('Can convert cookie object to cookie KVPs', async t => {
  const expectedCookieKvps = 'foo=bar;up=down;'
  const cookies = {
    foo: 'bar',
    up: 'down'
  }
  const actualCookieKvps = convertCookiesToKvps(cookies)
  t.is(actualCookieKvps, expectedCookieKvps)
})

test('Can handle missing cookie object when converting to cookie KVPs', async t => {
  const expectedCookieKvps = ''
  const cookies = undefined
  const actualCookieKvps = convertCookiesToKvps(cookies)
  t.is(actualCookieKvps, expectedCookieKvps)
})
