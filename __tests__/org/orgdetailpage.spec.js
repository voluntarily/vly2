import test from 'ava'
import objectid from 'objectid'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { shallowWithIntl, mountWithIntl } from '../../lib/react-intl-test-helper'
import reduxApi from '../../lib/redux/reduxApi'
import { OrgDetailPage, OrgUnknown } from '../../pages/org/orgdetailpage'
import orgs from '../../server/api/organisation/__tests__/organisation.fixture'
import people from '../../server/api/person/__tests__/person.fixture'
import withMockRoute from '../../server/util/mockRouter'
import { MockWindowScrollTo } from '../../server/util/mock-dom-helpers'
import fetchMock from 'fetch-mock'
import { Provider } from 'react-redux'
import sinon from 'sinon'
import * as nextRouter from 'next/router'

MockWindowScrollTo.replaceForTest(test, global)
test.before('Setup Route', (t) => {
  const router = () => {
    return ({
      pathname: '/orgs',
      route: '/orgs',
      asPath: '/orgs',
      query: '',
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

test.before('Setup fixtures', (t) => {
  // This gives all the people fake ids to better represent a fake mongo db
  people.map(p => { p._id = objectid().toString() })
  orgs.map(org => { org._id = objectid().toString() })

  const me = people[1]

  const orgMembership = [
    {
      _id: objectid().toString(),
      status: 'orgadmin',
      person: people[0]._id,
      organisation: orgs[0]
    },
    {
      _id: objectid().toString(),
      status: 'member',
      person: people[1]._id,
      organisation: orgs[0]
    }
  ]
  t.context = {
    me,
    people,
    orgs,
    org: orgs[0],
    orgMembership
  }
  t.context.defaultstore = {
    session: {
      isAuthenticated: true,
      user: { nickname: me.nickname },
      me
    },
    organisations: {
      sync: true,
      syncing: false,
      loading: false,
      data: [orgs[1]],
      request: null
    },
    members: {
      sync: true,
      syncing: false,
      loading: false,
      data: orgMembership,
      request: null
    },
    tags: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    }
  }
  t.context.mockStore = configureStore([thunk])(t.context.defaultstore)
})

test('OrgDetailPage GetInitialProps non member', async t => {
  // first test GetInitialProps
  const ctx = {
    store: t.context.mockStore,
    query: {
      id: t.context.org._id
    }
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock
    .get(`path:/api/organisations/${t.context.org._id}`, { body: { status: 200 } })
    .get('path:/api/members/', { body: { status: 200 } })
    .get('path:/api/tags/', { body: [] })
  const props = await getServerSideProps(ctx)
  t.false(props.isNew)
  t.is(props.orgid, t.context.org._id)
})

test('OrgDetailPage GetInitialProps anon', async t => {
  const store = {
    session: {
      isAuthenticated: false
    },
    organisations: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    },
    members: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    },
    tags: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    }
  }
  const mockStore = configureStore([thunk])(store)
  // first test GetInitialProps
  const ctx = {
    store: mockStore,
    query: {
      id: t.context.org._id
    }
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock
    .get(`path:/api/organisations/${t.context.org._id}`, { body: { status: 200 } })
    .get('path:/api/members/', { body: { status: 200 } })
    .get('path:/api/tags/', { body: [] })
  const props = await getServerSideProps(ctx)
  t.false(props.isNew)
  t.is(props.orgid, t.context.org._id)
})

test('OrgDetailPage GetInitialProps new', async t => {
  // first test GetInitialProps
  const ctx = {
    store: t.context.mockStore,
    query: {
      new: 'new'
    }
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock
    .get(`path:/api/organisations/${t.context.org._id}`, { body: { status: 200 } })
    .get('path:/api/members/', { body: { status: 200 } })
    .get('path:/api/tags/', { body: [] })
  const props = await getServerSideProps(ctx)
  t.true(props.isNew)
  t.is(props.orgid, null)
})

test('render OrgDetailPage loading ', async t => {
  // first test GetInitialProps
  const loading = {
    sync: false,
    syncing: false,
    loading: true,
    data: [],
    request: null
  }
  const props = {
    isNew: false,
    orgid: t.context.orgs[0],
    organisations: loading,
    members: loading,
    isAuthenticated: true,
    me: t.context.people[1]
  }

  const wrapper = shallowWithIntl(
    <OrgDetailPage {...props} />
  )
  t.false(wrapper.exists('OrgBanner'))
})

test('render OrgDetailPage anon ', async t => {
  const props = {
    isNew: false,
    orgid: t.context.orgs[0],
    organisations: t.context.defaultstore.organisations,
    members: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    },
    isAuthenticated: false,
    me: t.context.people[1]
  }

  const wrapper = shallowWithIntl(
    <OrgDetailPage {...props} />
  )
  t.is(wrapper.find('title').text(), 'OMGTech - Voluntarily')
  t.true(wrapper.exists('OrgBanner'))
  t.true(wrapper.exists('OrgTabs'))
  t.false(wrapper.exists('Connect(RegisterMemberSection)'))
})

test('render OrgDetailPage member ', async t => {
  // first test GetInitialProps
  const props = {
    isNew: false,
    orgid: t.context.orgs[0],
    organisations: t.context.defaultstore.organisations,
    members: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    },
    isAuthenticated: true,
    me: t.context.people[1]
  }

  const wrapper = shallowWithIntl(
    <OrgDetailPage {...props} />
  )
  t.is(wrapper.find('title').text(), 'OMGTech - Voluntarily')
  t.true(wrapper.exists('OrgBanner'))
  t.true(wrapper.exists('OrgTabs'))
  t.true(wrapper.exists('Connect(RegisterMemberSection)'))
})

test('render OrgDetailPage OrgAdmin ', async t => {
  // first test GetInitialProps
  const props = {
    isNew: false,
    orgid: t.context.orgs[0],
    organisations: t.context.defaultstore.organisations,
    members: t.context.defaultstore.members,
    me: t.context.people[1],
    isAuthenticated: true
  }

  const wrapper = shallowWithIntl(
    <OrgDetailPage {...props} />
  )
  t.is(wrapper.find('title').text(), 'OMGTech - Voluntarily')
  t.true(wrapper.exists('OrgBanner'))
  t.true(wrapper.exists('OrgTabs'))
})

test('OrgUnknown', t => {
  const wrapper = shallowWithIntl(
    <OrgUnknown />
  )
  t.is(wrapper.find('MemoizedFormattedMessage').first().props().id, 'orgDetailPage.OrgNotFound')
  t.is(wrapper.find('MemoizedFormattedMessage').last().props().id, 'orgDetailPage.showOrgs')
})

test('edit and save existing org', async t => {
  const props = {
    isNew: false,
    orgid: t.context.orgs[0],
    organisations: {
      sync: true,
      syncing: false,
      loading: false,
      data: [orgs[0]],
      request: null
    },
    members: t.context.defaultstore.members,
    me: t.context.people[1],
    isAuthenticated: true,
    tags: { data: [] },
    dispatch: (p) => {
      return [t.context.orgs[0]]
    }
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OrgDetailPage {...props} />
    </Provider>
  )
  // click on edit tab
  findAntTabByText(wrapper.find('.ant-tabs-tab'), 'Edit').simulate('click')

  t.true(wrapper.exists('OrgDetailForm'))
  const cancelButton = wrapper.find('button').at(1)
  t.is(cancelButton.text(), 'Cancel')
  cancelButton.simulate('click')
  wrapper.update()

  findAntTabByText(wrapper.find('.ant-tabs-tab'), 'Edit').simulate('click')

  const saveButton = wrapper.find('button').first()
  t.is(saveButton.text(), 'Save')
  wrapper.find('Form').first().simulate('submit')
  wrapper.update()
})

test('edit and save new org', async t => {
  const newOrg = { ...orgs[0], _id: null }
  const props = {
    isNew: true,
    orgid: null,
    organisations: {
      sync: true,
      syncing: false,
      loading: false,
      data: newOrg,
      request: null
    },
    isAuthenticated: true,
    members: t.context.defaultstore.members,
    me: t.context.people[1],
    tags: { data: [] },
    dispatch: (p) => {
      return [t.context.orgs[0]]
    }
  }

  const RoutedOrgDetailPage = withMockRoute(OrgDetailPage)

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOrgDetailPage {...props} />
    </Provider>
  )
  // new starts in edit mode
  const cancelButton = wrapper.find('button').at(1)
  t.is(cancelButton.text(), 'Cancel')
  cancelButton.simulate('click')
  wrapper.update()
  t.true(wrapper.exists('OrgBanner'))
  t.true(wrapper.exists('VTabs'))
  t.is(wrapper.find('VTabs').props().defaultActiveKey, 'about')

  findAntTabByText(wrapper.find('.ant-tabs-tab'), 'Edit').simulate('click')

  t.true(wrapper.exists('OrgDetailForm'))
  const saveButton = wrapper.find('button').first()
  t.is(saveButton.text(), 'Save')
  wrapper.find('Form').first().simulate('submit')
  wrapper.update()
})

test('render OrgDetailPage Unknown ', async t => {
  // first test GetInitialProps
  const props = {
    isNew: false,
    orgid: '12345678',
    organisations: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    },
    me: t.context.people[1]
  }
  const wrapper = shallowWithIntl(<OrgDetailPage {...props} />)
  t.true(wrapper.exists('OrgUnknown'))
})

test('History tab - "op" organisation', async t => {
  const props = {
    isNew: false,
    orgid: t.context.orgs[0],
    organisations: t.context.defaultstore.organisations,
    members: t.context.defaultstore.members,
    isAuthenticated: false,
    me: t.context.people[1]
  }

  const wrapper = mountWithIntl(
    <OrgDetailPage {...props} />
  )

  const historyTab = wrapper.find('TabPane[orgTab="history"]')

  t.true(
    historyTab.exists(),
    'History tab should display for "op" organisations'
  )
})

test('History tab - non "op" organisation', async t => {
  const organisation = Object.assign({}, t.context.orgs[0])

  const props = {
    isNew: false,
    orgid: organisation._id,
    organisations: [organisation],
    members: t.context.defaultstore.members,
    isAuthenticated: false,
    me: t.context.people[1]
  }

  const wrapper = mountWithIntl(
    <OrgDetailPage {...props} />
  )

  t.false(
    wrapper.exists('TabPane[orgTab="history"]'),
    'History tab should not display for non "op" organisations'
  )
})

const findAntTabByText = (tabs, tabText) => {
  const matchedTabs = tabs.filterWhere((tab) => tab.text() === tabText)

  if (matchedTabs.length === 1) {
    return matchedTabs.first()
  } else if (matchedTabs > 1) {
    throw new Error(`Multiple tabs matched with text: "${tabText}"`)
  } else {
    throw new Error(`No tabs found with text: "${tabText}"`)
  }
}
