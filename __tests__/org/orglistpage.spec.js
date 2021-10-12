import test from 'ava'
import React from 'react'
import sinon from 'sinon'
import { OrgListPage, gssp } from '../../pages/orgs/orglistpage'
import { shallowWithIntl } from '../../lib/react-intl-test-helper'
import orgs from '../../server/api/organisation/__tests__/organisation.fixture'
import objectid from 'objectid'

test.before('Setup fixtures', (t) => {
  // not using mongo or server here so faking ids
  orgs.map(p => { p._id = objectid().toString() })
  t.context.props = {
    organisations: {
      sync: true,
      syncing: false,
      loading: false,
      data: orgs,
      request: null
    }
  }
})

test('run getServerSideProps', async t => {
  // first test GetInitialProps
  const action = sinon.fake()

  const store = {
    dispatch: (ACTION) => {
      action()
      return Promise.resolve(t.context.props)
    }
  }
  await gssp({ store })
  t.true(action.calledOnce)
})

test('render OrgList', t => {
  const wrapper = shallowWithIntl(<OrgListPage {...t.context.props} />)
  t.is(wrapper.find('Button').length, 0)
  t.truthy(wrapper.find('OpList'))
})

test('render OrgList as admin', async t => {
  const me = {
    name: 'Mr Admin',
    nickname: 'testadminer',
    email: 'andrew@groat.nz',
    role: ['admin']
  }

  const wrapper = shallowWithIntl(<OrgListPage me={me} {...t.context.props} />)
  t.is(wrapper.find('h1 MemoizedFormattedMessage').first().props().id, 'org.list.heading')
  t.is(wrapper.find('Button').length, 1)
  t.truthy(wrapper.find('OpList'))
})

test('render OpList with dispatch error', async t => {
  t.plan(1)
  // first test GetInitialProps
  const store = {
    dispatch: (ACTION) => {
      throw Error('Catch This!')
    }
  }
  await t.throwsAsync(async () => {
    await gssp({ store })
  }, { message: 'Catch This!' })
})
