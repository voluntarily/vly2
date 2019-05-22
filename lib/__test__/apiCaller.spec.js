import test from 'ava'
import 'isomorphic-fetch'
import callApi, { API_URL } from '../apiCaller'
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
  // console.log(fetchMock.calls(MATCHED))
  // console.log(fetchMock.calls(UNMATCHED))
  fetchMock.restore()
})

test.todo('Test failure modes of the API call.')
// test('getAPI handles server errors', async t => {

//   fetchMock.getOnce(`*`, 500)
//   const error = await t.throwsAsync( () => callApi('health'))
//   t.is(error.status, 500)
// })

// test.only('getAPI handles data errors', async t => {

//   fetchMock.getOnce(`${API_URL}/nothere`, { status: 404, body: { message: 'These are not the pages you are looking for' } } )
//   const error = await t.throwsAsync( () => callApi('nothere'), {is: 'These are not the pages you are looking for'})
//   console.log(error)
//   t.is(error.message, 'These are not the pages you are looking for')
// })
