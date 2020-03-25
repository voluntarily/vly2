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
import * as nextRouter from 'next/router'

test.before('Setup fixtures', (t) => {
  // not using mongo or server here so faking ids
  acts.map(p => { p._id = objectid().toString() })
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]
  orgs.map(p => { p._id = objectid().toString() })
  t.context = {
    acts,
    people,
    orgs,
    me
  }
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
          me
        }
      })
    },
    dispatch: (ACTION) => {
      return Promise.resolve(acts[0])
    }
  }
  t.context.query = {
    id: 'activityid'
  }
  t.context.props = {
    me,
    session: {
      isAuthenticated: true,
      user: { nickname: me.nickname, email: me.email },
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
      sync: true,
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
      sync: true,
      syncing: false,
      loading: false,
      data: tags,
      request: null
    }
  }
})

test.before('Setup Route', (t) => {
  const router = () => {
    return ({
      pathname: '/test',
      route: '/test',
      query: { id: 12345 },
      asPath: '/test/12345',
      initialProps: {},
      pageLoader: sinon.fake(),
      App: sinon.fake(),
      Component: sinon.fake(),
      replace: sinon.fake(),
      push: sinon.fake(),
      back: sinon.fake()
    })
  }
  sinon.replace(nextRouter, 'useRouter', router)
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
  t.is(wrapper.find('title').first().text(), "1 What's my line - Careers panel game - Voluntarily")
  t.truthy(wrapper.find('ActDetail').first())
})

test('render ActDetailPage - empty acts', async t => {
  const ps = await ActDetailPage.getInitialProps({ store: t.context.store, query: t.context.query })
  const props = {
    ...t.context.props,
    ...ps,
    activities: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    }
  }
  const RoutedActDetailPage = withMockRoute(ActDetailPage)

  const outer = shallowWithIntl(<RoutedActDetailPage {...props} />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  t.true(wrapper.exists('ActUnkown'))
})

test('render ActDetailPage - loading', async t => {
  const ps = await ActDetailPage.getInitialProps({ store: t.context.store, query: t.context.query })
  const props = {
    ...t.context.props,
    ...ps,
    activities: {
      sync: false,
      syncing: false,
      loading: true,
      data: [],
      request: null
    }
  }
  const RoutedActDetailPage = withMockRoute(ActDetailPage)

  const outer = shallowWithIntl(<RoutedActDetailPage {...props} />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  t.is(wrapper.find('title').first().length, 0)
})

test('Edit new ActDetailPage', async t => {
  const newAct = { ...t.context.acts[1] }
  delete newAct._id
  const query = {
    new: 'new'
  }
  const ps = await ActDetailPage.getInitialProps({ store: t.context.store, query })
  const props = {
    ...t.context.props,
    ...ps,
    dispatch: fn => { return [{ ...newAct, _id: 'newActId' }] }
  }
  const RoutedActDetailPage = withMockRoute(ActDetailPage)

  const outer = shallowWithIntl(<RoutedActDetailPage {...props} />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  t.is(wrapper.find('title').first().text(), 'Edit Activity - Voluntarily')

  const form = wrapper.find('Form(ActDetailForm)').first()
  // act should be blank
  t.is(form.props().act.status, 'draft')
  t.is(form.props().act.name, '')
  // cancel should call Back

  form.props().onCancel() // let the hooks complete
  form.props().onSubmit(newAct)
  // save and return to details
})
