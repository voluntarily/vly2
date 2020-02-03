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

MockWindowScrollTo.replaceForTest(test, global)

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
  const props = await OrgDetailPage.getInitialProps(ctx)
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
  const props = await OrgDetailPage.getInitialProps(ctx)
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
  const props = await OrgDetailPage.getInitialProps(ctx)
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
  t.true(wrapper.exists('OrgEditButton'))
})

test('OrgUnknown', t => {
  const wrapper = shallowWithIntl(
    <OrgUnknown />
  )
  t.is(wrapper.find('FormattedMessage').first().props().id, 'orgDetailPage.OrgNotFound')
  t.is(wrapper.find('FormattedMessage').last().props().id, 'orgDetailPage.showOrgs')
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
    dispatch: (p) => {
      return [t.context.orgs[0]]
    }
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OrgDetailPage {...props} />
    </Provider>
  )
  let editButton = wrapper.find('button').at(2)
  t.is(editButton.text(), 'Edit')
  editButton.simulate('click')
  wrapper.update()
  t.true(wrapper.exists('OrgDetailForm'))
  const cancelButton = wrapper.find('button').at(1)
  t.is(cancelButton.text(), 'Cancel')
  cancelButton.simulate('click')
  wrapper.update()
  editButton = wrapper.find('button').at(2)
  t.is(editButton.text(), 'Edit')
  editButton.simulate('click')
  wrapper.update()
  const saveButton = wrapper.find('button').first()
  t.is(saveButton.text(), 'Save')
  await wrapper.find('Form').first().simulate('submit')
  wrapper.update()
  editButton = wrapper.find('button').at(2)
  t.is(editButton.text(), 'Edit')
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
  let editButton = wrapper.find('button').at(2)
  t.is(editButton.text(), 'Edit')
  editButton.simulate('click')
  wrapper.update()
  t.true(wrapper.exists('OrgDetailForm'))
  const cancelButton = wrapper.find('button').at(1)
  t.is(cancelButton.text(), 'Cancel')
  cancelButton.simulate('click')
  wrapper.update()
  editButton = wrapper.find('button').at(2)
  t.is(editButton.text(), 'Edit')
  editButton.simulate('click')
  wrapper.update()
  const saveButton = wrapper.find('button').first()
  t.is(saveButton.text(), 'Save')
  await wrapper.find('Form').first().simulate('submit')
  wrapper.update()
  editButton = wrapper.find('button').at(2)
  t.is(editButton.text(), 'Edit')
})

test('render OrgDetailPage Unknown ', async t => {
  // first test GetInitialProps
  const props = {
    isNew: false,
    orgid: t.context.orgs[0],
    organisations: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    },
    me: t.context.people[1]
  }

  const wrapper = shallowWithIntl(
    <OrgDetailPage {...props} />
  )
  t.true(wrapper.exists('OrgUnknown'))
})

// function makeFetchMock (organisationId) {
//   const myMock = fetchMock.sandbox()
//   myMock.get(API_URL + '/interests/?op=' + organisationId, { body: { status: 200 } })
//   return myMock
// }

// test('send "PUT" request to redux-api when organisation is canceled and confirmed on OrgDetailPage', t => {
//   const organisationToCancel = t.context.op
//   const myMock = makeFetchMock(organisationToCancel._id)
//   myMock.put(API_URL + '/organisations/' + organisationToCancel._id, { body: { status: 200 } })
//   reduxApi.use('fetch', adapterFetch(myMock))
//   const props = {
//     me: t.context.me,
//     dispatch: t.context.mockStore.dispatch
//   }
//   const RoutedOrgDetailPage = withMockRoute(OrgDetailPageWithOrgs)
//   const wrapper = mountWithIntl(
//     <Provider store={t.context.mockStore}>
//       <RoutedOrgDetailPage {...props} />
//     </Provider>
//   )
//   t.context.mockStore.clearActions()
//   wrapper.find('Popconfirm').filter('#cancelOrgPopConfirm').props().onConfirm({})
//   t.is(t.context.mockStore.getActions()[0].type, '@@redux-api@organisations')
//   t.is(t.context.mockStore.getActions()[0].request.params.method, 'PUT')
//   t.is(t.context.mockStore.getActions()[0].request.pathvars.id, t.context.op._id)
// })

// test('can Edit the Org', t => {
//   const organisationToEdit = t.context.op
//   const myMock = makeFetchMock(organisationToEdit._id)
//   myMock.post(API_URL + '/tags/', { body: { status: 200 } })
//   myMock.put(API_URL + '/organisations/' + organisationToEdit._id, { body: { status: 200 } })
//   reduxApi.use('fetch', adapterFetch(myMock))

//   const props = {
//     me: t.context.me,
//     dispatch: t.context.mockStore.dispatch
//   }
//   const RoutedOrgDetailPage = withMockRoute(OrgDetailPageWithOrgs)
//   const wrapper = mountWithIntl(
//     <Provider store={t.context.mockStore}>
//       <RoutedOrgDetailPage {...props} />
//     </Provider>
//   )
//   let editButton = wrapper.find('#editOrgBtn').first()
//   t.is(editButton.text(), 'Edit')
//   editButton.simulate('click')

//   // should switch into edit mode
//   const cancelButton = wrapper.find('#cancelOrgBtn').first()
//   t.is(cancelButton.text(), 'Cancel')
//   cancelButton.simulate('click')
//   editButton = wrapper.find('#editOrgBtn').first()
//   t.is(editButton.text(), 'Edit')
//   t.is(wrapper.find('h1').first().text(), organisationToEdit.name)
//   editButton.simulate('click')
//   const saveButton = wrapper.find('#saveOrgBtn').first()
//   t.is(saveButton.text(), 'Save as draft')
//   saveButton.simulate('click')
// })

// test('display unavailable organisation message when organisation id is invalid on OrgDetailPage', t => {
//   const props = {
//     me: t.context.me
//   }
//   const mockStore = configureStore([thunk])(
//     {
//       session: {
//         isAuthenticated: false
//       },
//       organisations: {
//         sync: true,
//         loading: false,
//         data: []
//       }
//     }
//   )

//   const RoutedOrgDetailPage = withMockRoute(OrgDetailPageWithOrgs)
//   const wrapper = mountWithIntl(
//     <Provider store={mockStore}>
//       <RoutedOrgDetailPage {...props} />
//     </Provider>
//   )
//   t.is(wrapper.find('h2').first().text(), 'Sorry, this organisation is not available')
// })

// test('display loading organisation message when organisation is loading', t => {
//   const props = {
//     me: t.context.me
//   }
//   const mockStore = configureStore([thunk])(
//     {
//       session: {
//         isAuthenticated: false
//       },
//       organisations: {
//         loading: true,
//         data: []
//       }
//     }
//   )

//   const RoutedOrgDetailPage = withMockRoute(OrgDetailPageWithOrgs)
//   const wrapper = mountWithIntl(
//     <Provider store={mockStore}>
//       <RoutedOrgDetailPage {...props} />
//     </Provider>
//   )
//   t.is(wrapper.find('img').prop('src'), '/static/loading.svg')
// })

// test('can create new Org from blank', t => {
//   const organisationToEdit = t.context.org
//   const myMock = makeFetchMock(organisationToEdit._id)
//   myMock.put(API_URL + '/organisations/' + organisationToEdit._id, { body: { status: 200 } })
//   reduxApi.use('fetch', adapterFetch(myMock))

//   const props = {
//     isNew: true,
//     me: t.context.me,
//     dispatch: t.context.mockStore.dispatch
//   }
//   const RoutedOrgDetailPage = withMockRoute(OrgDetailPageWithOrgs)
//   const wrapper = mountWithIntl(
//     <Provider store={t.context.mockStore}>
//       <RoutedOrgDetailPage {...props} />
//     </Provider>
//   )

//   const saveButton = wrapper.find('#saveOrgBtn').first()
//   t.is(saveButton.text(), 'Save as draft')
//   // saveButton.simulate('click')
// })

// test('can cancel new Org from blank', t => {
//   const organisationToEdit = t.context.op
//   const myMock = makeFetchMock(organisationToEdit._id)
//   myMock.post(API_URL + '/tags/', { body: { status: 200 } })
//   myMock.put(API_URL + '/organisations/' + organisationToEdit._id, { body: { status: 200 } })
//   reduxApi.use('fetch', adapterFetch(myMock))

//   const props = {
//     isNew: true,
//     me: t.context.me,
//     dispatch: t.context.mockStore.dispatch
//   }
//   const RoutedOrgDetailPage = withMockRoute(OrgDetailPageWithOrgs)
//   const wrapper = mountWithIntl(
//     <Provider store={t.context.mockStore}>
//       <RoutedOrgDetailPage {...props} />
//     </Provider>
//   )
//   const saveButton = wrapper.find('#saveOrgBtn').first()
//   t.is(saveButton.text(), 'Save as draft')
//   const cancelButton = wrapper.find('#cancelOrgBtn').first()
//   t.is(cancelButton.text(), 'Cancel')
//   cancelButton.simulate('click')
// })

// test('can create new Org from Activity', t => {
//   const organisationToEdit = t.context.op
//   const fromActivity = t.context.acts[0]
//   const myMock = makeFetchMock(organisationToEdit._id)
//   myMock.post(API_URL + '/tags/', { body: { status: 200 } })
//   myMock.put(API_URL + '/organisations/' + organisationToEdit._id, { body: { status: 200 } })
//   reduxApi.use('fetch', adapterFetch(myMock))

//   const props = {
//     isNew: true,
//     me: t.context.me,
//     dispatch: t.context.mockStore.dispatch,
//     actid: fromActivity._id
//   }
//   const RoutedOrgDetailPage = withMockRoute(OrgDetailPageWithOrgs)
//   const wrapper = mountWithIntl(
//     <Provider store={t.context.mockStore}>
//       <RoutedOrgDetailPage {...props} />
//     </Provider>
//   )
//   // check fields are initialised
//   t.is(wrapper.find('#organisation_detail_form_name').first().prop('value'), fromActivity.name)
//   t.is(wrapper.find('#organisation_detail_form_subtitle').first().prop('value'), fromActivity.subtitle)
//   t.is(wrapper.find('#organisation_detail_form_imgUrl').first().prop('value'), fromActivity.imgUrl)
//   const saveButton = wrapper.find('#saveOrgBtn').first()
//   t.is(saveButton.text(), 'Save as draft')
// })

// test('page loads when user is not signed in but does not show edit VP-499', t => {
//   const props = {
//     me: '',
//     dispatch: t.context.mockStore.dispatch
//   }
//   const RoutedOrgDetailPage = withMockRoute(OrgDetailPageWithOrgs)
//   const wrapper = mountWithIntl(
//     <Provider store={t.context.mockStore}>
//       <RoutedOrgDetailPage {...props} />
//     </Provider>
//   )

//   t.falsy(wrapper.find('#editOrgBtn').length)
// })
