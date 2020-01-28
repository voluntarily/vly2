import test from 'ava'
import 'isomorphic-fetch'
import callApi, { API_URL, convertCookiesToKvps } from '../callApi'
import fetchMock from 'fetch-mock'
import sinon from 'sinon'

test.beforeEach(t => {
  t.context.cls = console.error
  console.error = sinon.spy()
})

test.afterEach(t => {
  fetchMock.reset()
  console.error = t.context.cls
})
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

test('getAPI handles data errors', async t => {
  fetchMock.getOnce(`${API_URL}/nothere`, { status: 404, body: { message: 'These are not the pages you are looking for' } })
  const message = '{"status":404,"statusText":"Not Found","message":"{\\"message\\":\\"These are not the pages you are looking for\\"}"}'
  await t.throwsAsync(() => callApi('nothere'), message)
  fetchMock.restore()
})

test('When server returns 500 status code then Promise should be rejected with the status', async t => {
  fetchMock.restore()
  fetchMock.getOnce('*', 500)
  const message = '{"status":500,"statusText":"Internal Server Error"}'
  await t.throwsAsync(() => callApi('health'), message)
})

test('When server throws an error then Promise should be rejected with the same error', async t => {
  fetchMock.restore()
  fetchMock.getOnce(`${API_URL}/health`, Promise.reject(new Error('foo')))
  await t.throwsAsync(() => callApi('health'), 'foo')
})

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

test.serial('Can POST data', async t => {
  const result = {
    id: '1245'
  }
  const cookies = {
    foo: 'bar',
    up: 'down'
  }
  fetchMock.postOnce('path:/api/postdata', result)

  const body = { item: 'value' }
  const json = await callApi('postdata', 'post', body, cookies)
  t.is(json.id, '1245')
})
