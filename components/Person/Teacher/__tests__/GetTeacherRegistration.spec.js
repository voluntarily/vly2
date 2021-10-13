import test from 'ava'
import fetchMock from 'fetch-mock'
import objectid from 'objectid'
import sinon from 'sinon'
import { shallowWithIntl } from '../../../../lib/react-intl-test-helper'
import people from '../../../../server/api/person/__tests__/person.fixture'
import GetTeacherRegistration, { RegError } from '../GetTeacherRegistration'

test.before('Setup fixtures', (t) => {
  // This gives all the people fake ids to better represent a fake mongo db
  t.context.people = people.forEach(p => { p._id = objectid().toString() })
  t.context.teacher = people.find(p => p.nickname === 'niceteacheralice')
})

test.beforeEach(t => {
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
})

test.afterEach(t => fetchMock.reset())

test.serial('TeacherRegistrationRecord renders properly', async t => {
  const trn = '123456'
  t.context.mockServer.get(`end:/api/registerRequestor?trn=${trn}`, { body: t.context.teacher })
  const mockOnChange = sinon.spy()

  const wrapper = shallowWithIntl(<GetTeacherRegistration onChange={mockOnChange} />)
  const search = wrapper.find('Search')
  await search.prop('onSearch')(trn)
  t.truthy(mockOnChange.calledOnce)
  t.truthy(mockOnChange.calledWith(t.context.teacher))
})

test.serial('TeacherRegistrationRecord receives error', async t => {
  const cls = console.error
  console.error = sinon.spy()

  const trn = '000000'
  t.context.mockServer.get('end:/api/registerRequestor?trn=000000', 404)
  const mockOnChange = sinon.spy()

  const wrapper = shallowWithIntl(<GetTeacherRegistration onChange={mockOnChange} />)
  const search = wrapper.find('Search')
  await search.prop('onSearch')(trn)
  t.truthy(mockOnChange.notCalled)
  t.truthy(wrapper.find('Alert').exists())
  console.error = cls
})

test('TeacherRegistrationRecord renders error', async t => {
  const wrapper = shallowWithIntl(<RegError />)
  t.truthy(wrapper.find('Link').exists())
})
