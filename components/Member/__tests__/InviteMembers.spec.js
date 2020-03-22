import InviteMembers from '../InviteMembers'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import orgs from '../../../server/api/organisation/__tests__/organisation.fixture'
import fetchMock from 'fetch-mock'
import { MemberStatus } from '../../../server/api/member/member.constants'
import objectid from 'objectid'

test.before('Setup fixtures', (t) => {
  t.context.orgs = orgs.map(p => { p._id = objectid().toString() })
})
test.beforeEach(t => {
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
})
test.afterEach(t => {
  fetchMock.reset()
})
test('constructs properly', async t => {
  t.context.mockServer.getOnce('*', {})

  const wrapper = shallowWithIntl(
    <InviteMembers
      org={orgs[0]}
    />)

  const adminMsg = wrapper.find('TextArea').first()
  adminMsg.simulate('change', { target: { value: 'Thanks for following' } })
  const group = wrapper.find('RadioGroup').first()
  t.is(wrapper.find('RadioButton').length, 4)
  group.simulate('change', { target: { value: MemberStatus.FOLLOWER } })
})
