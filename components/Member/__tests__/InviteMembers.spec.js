import test from 'ava'
import fetchMock from 'fetch-mock'
import objectid from 'objectid'

import InviteMembers from '../InviteMembers'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import orgs from '../../../server/api/organisation/__tests__/organisation.fixture'
import { MemberStatus } from '../../../server/api/member/member.constants'

test.before('Setup fixtures', (t) => {
  orgs.forEach(p => { p._id = objectid().toString() })
  t.context.orgs = orgs
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

  const wrapper = mountWithIntl(
    <InviteMembers
      org={orgs[0]}
    />)
  const adminMsg = wrapper.find('TextArea').first()
  adminMsg.simulate('change', { target: { value: 'Thanks for following' } })
  const group = wrapper.find('ForwardRef').first()
  t.is(wrapper.find('Radio').length, 4)
  group.simulate('change', { target: { value: MemberStatus.FOLLOWER } })
})
