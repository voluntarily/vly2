import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../server/server'
import MemoryMongo from '../../server/util/test-memory-mongo'
import { loadInterestFixtures, clearInterestFixtures, sessions } from './invite-school.fixture'
import fetchMock from 'fetch-mock'
import SchoolLookUp from '../../server/api/school-lookup/school-lookup'

let originalConsole = null

test.before('setup database and app', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
  await appReady

  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.beforeEach('populate database fixtures', async (t) => {
  originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  }

  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}

  t.context.fixtures = await loadInterestFixtures()
})

test.afterEach.always(async (t) => {
  console.log = originalConsole.log
  console.warn = originalConsole.warn
  console.error = originalConsole.error

  t.context.mockServer.reset()
  await clearInterestFixtures()
})

// ADMIN Menu

test.serial('Load admin  page as admin', async (t) => {
  const response = await request(server)
    .get('/admin')
    .set('Cookie', [`idToken=${sessions[0].idToken}`])

  t.is(response.status, 200, 'Should be allowed to view page')
})

test.serial('Load admin page as anon', async (t) => {
  const response = await request(server)
    .get('/admin')
  t.is(response.status, 302, 'Should be redirected to login')
})

test.serial('Load admin page as authenticated', async (t) => {
  const response = await request(server)
    .get('/admin')
    .set('Cookie', [`idToken=${sessions[1].idToken}`])

  t.truthy(response.text.includes('<h1>Access denied</h1><p>You do not have permission to view this page.</p>'))
})

// GOALS
test.serial('Load admin/goals  page as admin', async (t) => {
  const response = await request(server)
    .get('/admin/goals')
    .set('Cookie', [`idToken=${sessions[0].idToken}`])

  t.is(response.status, 200, 'Should be allowed to view page')
})

// INVITE-SCHOOL
test.serial('Load invite school page as admin', async (t) => {
  t.context.mockServer.get(
    'end:/api/schools?p=schoolId%20name',
    { body: await SchoolLookUp.find() }
  )

  const response = await request(server)
    .get('/admin/invite-school')
    .set('Cookie', [`idToken=${sessions[0].idToken}`])

  t.is(response.status, 200, 'Should be allowed to view page')
})

test.serial('Load invite school page as anon', async (t) => {
  t.context.mockServer.get(
    'end:/api/schools?p=schoolId%20name',
    { status: 403 }
  )

  const response = await request(server)
    .get('/admin/invite-school')
  t.is(response.status, 302, 'Should be redirected to login')
})

test.serial('Load invite school page as authenticated', async (t) => {
  t.context.mockServer.get(
    'end:/api/schools?p=schoolId%20name',
    { status: 403 }
  )

  const response = await request(server)
    .get('/admin/invite-school')
    .set('Cookie', [`idToken=${sessions[1].idToken}`])

  t.truthy(response.text.includes('<h1>Access denied</h1><p>You do not have permission to view this page.</p>'))
})

// TEST
test.serial('Load admin/test page as admin', async (t) => {
  const response = await request(server)
    .get('/admin/test')
    .set('Cookie', [`idToken=${sessions[0].idToken}`])

  t.is(response.status, 200, 'Should be allowed to view page')
})
