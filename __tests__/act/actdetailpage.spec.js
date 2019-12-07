import React from 'react'
import test from 'ava'
import { ActDetailPage } from '../../pages/act/actdetailpage'
import { shallowWithIntl } from '../../lib/react-intl-test-helper'
import objectid from 'objectid'
import withMockRoute from '../../server/util/mockRouter'
import sinon from 'sinon'
import acts from '../../server/api/activity/__tests__/activity.fixture'
import people from '../../server/api/person/__tests__/person.fixture'
import orgs from '../../server/api/organisation/__tests__/organisation.fixture'
import tags from '../../server/api/tag/__tests__/tag.fixture'
import { MemberStatus } from '../../server/api/member/member.constants'

test.before('Setup fixtures', (t) => {
  // not using mongo or server here so faking ids
  acts.map(p => { p._id = objectid().toString() })
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]
  orgs.map(p => { p._id = objectid().toString() })

  // Initial members added into test db
  const members = [
    {
      _id: objectid().toString(),
      person: me._id,
      organisation: orgs[0],
      validation: 'test member',
      status: MemberStatus.MEMBER
    }
  ]
  t.context.store = {
    getState: () => {
      return ({
        session: {
          me: { _id: 'fakepersonid' }
        }
      })
    },
    dispatch: (ACTION) => {
      // console.log('dispatch', ACTION)
      return Promise.resolve(acts[0])
    }
  }
  t.context.query = {
    id: 'activityid'
  }
  t.context.props = {
    session: {
      isAuthenticated: true,
      user: { nickname: me.nickname },
      me
    },
    members: {
      sync: true,
      syncing: false,
      loading: false,
      data: members,
      request: null
    },
    orgs: {
      sync: false,
      syncing: false,
      loading: false,
      data: orgs,
      request: null
    },
    activities: {
      sync: true,
      syncing: false,
      loading: false,
      data: [acts[0]],
      request: null
    },
    tags: {
      sync: false,
      syncing: false,
      loading: false,
      data: tags,
      request: null
    }
  }
})

test('render ActDetailPage', async t => {
  const ps = await ActDetailPage.getInitialProps({ store: t.context.store, query: t.context.query })
  const props = {
    ...t.context.props,
    ...ps
  }
  const RoutedActDetailPage = withMockRoute(ActDetailPage)

  const outer = shallowWithIntl(<RoutedActDetailPage {...props} />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  console.log(wrapper.debug())
  t.is(wrapper.find('title').first().text(), "Voluntarily - 1 What's my line - Careers panel game")
  t.truthy(wrapper.find('ActDetail').first())
})

test.only('Edit new ActDetailPage', async t => {
  const query = {
    new: 'new'
  }
  const ps = await ActDetailPage.getInitialProps({ store: t.context.store, query })
  const props = {
    ...t.context.props,
    ...ps
  }
  const RoutedActDetailPage = withMockRoute(ActDetailPage)

  const outer = shallowWithIntl(<RoutedActDetailPage {...props} />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  console.log(wrapper.debug())
  t.is(wrapper.find('title').first().text(), "Voluntarily - 1 What's my line - Careers panel game")
  t.truthy(wrapper.find('ActDetail').first())
})
