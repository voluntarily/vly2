import test from 'ava'
import { mount } from 'enzyme'
import fetchMock from 'fetch-mock'
import { EducationSelector } from '../Input/EducationSelector'
import sinon from 'sinon'

test.before(t => {
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
})

test.afterEach(t => {
  fetchMock.reset()
})

test('mount the EducationSelector', async t => {
  const handleEducationChange = sinon.fake()
  t.context.mockServer.get('end:/api/education', { body: ['small', 'medium', 'large'] })

  const wrapper = mount(
    <EducationSelector onChange={handleEducationChange} value='small' />
  )
  t.true(wrapper.exists('Select'))
})
