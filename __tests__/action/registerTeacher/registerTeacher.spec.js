import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import objectid from 'objectid'
import { act } from 'react-dom/test-utils'
import fetchMock from 'fetch-mock'
import sinon from 'sinon'
import people from '../../../server/api/person/__tests__/person.fixture'
import { RegisterTeacher } from '../../../pages/action/registerTeacher'

test.before('Setup fixtures', (t) => {
  t.context.people = people.forEach(p => { p._id = objectid().toString() })
  t.context.teacher = people.find(p => p.nickname === 'niceteacheralice')
  t.context.unteacher = people[1]
})
test.beforeEach(t => {
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
  t.context.cls = console.error
  console.error = sinon.spy()
})

test.afterEach(t => {
  fetchMock.reset()
  console.error = t.context.cls
})

test.serial('render registerRequest with registered teacher', async t => {
  t.context.mockServer.get('end:/api/registerRequestor', { body: t.context.teacher })
  t.context.mockServer.get('end:api/registerRequestor/reset', { body: t.context.unteacher })
  const wrapper = mountWithIntl(<RegisterTeacher />)
  t.is(wrapper.find('h3').first().text(), 'Enable Requestor Status')
  await act(async () => { }) // let the hooks complete
  wrapper.update()
  // should be showing teacher record
  t.is(wrapper.find('TeacherRegistrationRecord').first().find('FormattedMessage').first().text(), 'Teacher Registration Record')

  const resetBtn = wrapper.find('button').first()
  t.is(resetBtn.text(), 'Reset Registration')
  await resetBtn.prop('onClick')()
  wrapper.update()
  // wrapper.instance.handleResetTeacherRegistration()
  t.is(wrapper.find('h5').last().text(), 'Enter your NZ Teacher Registration Number')
})

test.serial('render registerRequest with un-registered teacher', async t => {
  t.context.mockServer.get('end:/api/registerRequestor', { body: t.context.unteacher })

  const wrapper = mountWithIntl(<RegisterTeacher />)
  t.is(wrapper.find('h3').first().text(), 'Enable Requestor Status')
  await act(async () => { }) // let the hooks complete
  wrapper.update()
  // should be showing getTeacherRegistration form
  t.is(wrapper.find('GetTeacherRegistration').first().find('FormattedMessage').first().text(), 'You can validate as a teacher using your teacher registration number:')
})

test.serial('render registerRequest with errors', async t => {
  t.context.mockServer.get('end:/api/registerRequestor', 404)

  const wrapper = mountWithIntl(<RegisterTeacher />)
  await act(async () => { }) // let the hooks complete
  wrapper.update()

  // should be showing error message
  t.is(wrapper.find('GetTeacherRegistration').first().find('FormattedMessage').first().text(), 'You can validate as a teacher using your teacher registration number:')
})

test.serial('render registerRequest with registered teacher and erros', async t => {
  t.context.mockServer.get('end:/api/registerRequestor', { body: t.context.teacher })
  t.context.mockServer.get('end:api/registerRequestor/reset', 400)
  const wrapper = mountWithIntl(<RegisterTeacher />)
  t.is(wrapper.find('h3').first().text(), 'Enable Requestor Status')
  await act(async () => { }) // let the hooks complete
  wrapper.update()

  const resetBtn = wrapper.find('button').first()
  t.is(resetBtn.text(), 'Reset Registration')
  await resetBtn.prop('onClick')()
  wrapper.update()
  // wrapper.instance.handleResetTeacherRegistration()
  t.is(wrapper.find('h5').last().text(), 'Enter your NZ Teacher Registration Number')
})
