import React from 'react'
import test from 'ava'
import objectid from 'objectid'

import { ActDetailPage, gssp } from '../../pages/act/actdetailpage'
import { shallowWithIntl } from '../../lib/react-intl-test-helper'
import acts from '../../server/api/activity/__tests__/activity.fixture'
import people from '../../server/api/person/__tests__/person.fixture'
import orgs from '../../server/api/organisation/__tests__/organisation.fixture'
import tags from '../../server/api/tag/__tests__/tag.fixture'
import useMockRouter from '../../server/util/useMockRouter'

import { MemberStatus } from '../../server/api/member/member.constants'

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

test.before('Setup Route', useMockRouter('/test'), { id: 12345 })

test('render ActDetailPage', async t => {
  const ps = await gssp({ store: t.context.store, query: t.context.query })
  const props = {
    ...t.context.props,
    ...ps
  }

  const wrapper = shallowWithIntl(<ActDetailPage {...props} />)
  t.is(wrapper.find('title').first().text(), "1 What's my line - Careers panel game - Voluntarily")
  t.truthy(wrapper.find('ActDetail').first())
})

test('render ActDetailPage - empty acts', async t => {
  const ps = await gssp({ store: t.context.store, query: t.context.query })
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

  const wrapper = shallowWithIntl(<ActDetailPage {...props} />)
  t.true(wrapper.exists('ActUnknown'))
})

test('render ActDetailPage - loading', async t => {
  const ps = await gssp({ store: t.context.store, query: t.context.query })
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

  const wrapper = shallowWithIntl(<ActDetailPage {...props} />)
  t.is(wrapper.find('title').first().length, 0)
})

test('Edit new ActDetailPage', async t => {
  const newAct = { ...t.context.acts[1] }
  delete newAct._id
  const query = {
    new: 'new'
  }
  const ps = await gssp({ store: t.context.store, query })
  const props = {
    ...t.context.props,
    ...ps.props,
    dispatch: fn => { return [{ ...newAct, _id: 'newActId' }] }
  }
  const wrapper = shallowWithIntl(<ActDetailPage {...props} />)
  console.log(wrapper.debug())
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
