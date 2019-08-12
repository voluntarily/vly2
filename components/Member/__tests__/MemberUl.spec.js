import MemberUl from '../MemberUl'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import fixture from './member.fixture.js'

test.before('Setup fixtures', fixture)

test('show nothing if empty list given', t => {
  const wrapper = mountWithIntl(<MemberUl members={[]} />)
  t.is(wrapper.find('li').length, 0)
})

test('show orgs for person 0', t => {
  const myid = t.context.people[0]._id
  const members = t.context.members.filter(m => m.person._id === myid)
  const wrapper = mountWithIntl(<MemberUl members={members} />)
  t.is(wrapper.find('li').length, 8)
  t.regex(wrapper.find('li').first().text(), /Administrators/)
})

test('show orgs for person 1', t => {
  const myid = t.context.people[1]._id
  const members = t.context.members.filter(m => m.person._id === myid)
  const wrapper = mountWithIntl(<MemberUl members={members} />)
  t.is(wrapper.find('li').length, 3)
  t.regex(wrapper.find('li').first().text(), /Spark Ltd/)
})
