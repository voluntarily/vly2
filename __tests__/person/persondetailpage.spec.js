import test from 'ava'
import sinon from 'sinon'
import { shallowWithIntl } from '../../lib/react-intl-test-helper'
import withMockRoute from '../../server/util/mockRouter'
import { PersonDetailPage } from '../../pages/person/persondetailpage'
import objectid from 'objectid'
import orgs from '../../server/api/organisation/__tests__/organisation.fixture'
import people from '../../server/api/person/__tests__/person.fixture'

test.before('Setup fixtures', (t) => {
  people.map(p => { p._id = objectid().toString() })
  orgs.map(p => { p._id = objectid().toString() })
  const me = people[0]

  // I am orgAdmin of the first org (voluntarily) and member of the second org (OMGTech)
  const orgMembership = [
    {
      _id: objectid().toString(),
      status: 'orgadmin',
      person: me._id,
      organisation: orgs[0]
    },
    {
      _id: objectid().toString(),
      status: 'member',
      person: me._id,
      organisation: orgs[1]
    }
  ]

  t.context.store = {
    session: {
      isAuthenticated: true,
      user: { nickname: me.nickname },
      me
    },
    people: {
      sync: true,
      syncing: false,
      loading: false,
      data: [me],
      request: null
    },
    tags: {
      sync: true,
      syncing: false,
      loading: false,
      data: ['one', 'two', 'three'],
      request: null
    },
    locations: {
      sync: true,
      syncing: false,
      loading: false,
      data: ['Auckland, Wellington, Christchurch'],
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
})

test('PersonDetailPage GetInitialProps existing person', async t => {
  const me = people[0]
  const query = {
    id: me._id
  }
  const store = {
    dispatch: sinon.fake(),
    getState: () => {
      return ({ session: { me } })
    }
  }

  const props = await PersonDetailPage.getInitialProps({ store, query })
  t.false(props.isNew)
  t.is(props.personid, me._id)
  t.is(store.dispatch.callCount, 4)
})

test('PersonDetailPage GetInitialProps new person', async t => {
  const me = people[0]
  const query = {
    new: 'new'
  }
  const store = {
    dispatch: sinon.fake(),
    getState: () => {
      return ({ session: { me } })
    }
  }

  const props = await PersonDetailPage.getInitialProps({ store, query })
  t.true(props.isNew)
  t.is(props.personid, null)
  t.is(store.dispatch.callCount, 2)
})

test('render Loading PersonDetailPage ', async t => {
  const dali = people[1]
  const props = {
    ...t.context.store,
    me: dali,
    isNew: false,
    personid: dali._id,
    people: {
      sync: false,
      syncing: false,
      loading: true,
      data: [],
      request: null
    },
    members: {
      sync: false,
      syncing: false,
      loading: false,
      data: [],
      request: null
    }
  }

  const RoutedPersonDetailPage = withMockRoute(PersonDetailPage)
  const outer = shallowWithIntl(<RoutedPersonDetailPage {...props} />)
  const wrapper = outer.dive()

  t.false(wrapper.exists('PersonDetail'))
})

test('render unknown person PersonDetailPage ', async t => {
  const unknown = objectid.toString()
  const dali = people[1]

  const props = {
    ...t.context.store,
    me: dali,
    isNew: false,
    personid: unknown,
    people: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    },
    members: {
      sync: false,
      syncing: false,
      loading: false,
      data: [],
      request: null
    }
  }

  const RoutedPersonDetailPage = withMockRoute(PersonDetailPage)
  const outer = shallowWithIntl(<RoutedPersonDetailPage {...props} />)
  const wrapper = outer.dive()

  t.false(wrapper.exists('PersonDetail'))
  t.true(wrapper.exists('PersonNotAvailable'))
  t.is(wrapper.dive().find('FormattedMessage').first().props().id, 'person.notavailable')
})

test('render Dalis PersonDetailPage as non admin random person alice', async t => {
  const dali = people[1]
  const alice = people[2]
  const props = {
    ...t.context.store,
    me: alice,
    isNew: false,
    personid: dali._id,
    people: {
      sync: true,
      syncing: false,
      loading: false,
      data: [dali],
      request: null
    }
  }

  const RoutedPersonDetailPage = withMockRoute(PersonDetailPage)
  const outer = shallowWithIntl(<RoutedPersonDetailPage {...props} />)
  const wrapper = outer.dive()

  t.true(wrapper.exists('PersonDetail'))
  t.is(wrapper.find('PersonDetail').first().props().person, dali)

  // as I am no one there should be no buttons
  t.false(wrapper.exists('Button'))
})

test('render Dalis PersonDetailPage as admin ', async t => {
  const admin = people[0]
  const dali = people[1]
  const props = {
    ...t.context.store,
    me: admin,
    isNew: false,
    personid: dali._id,
    people: {
      sync: true,
      syncing: false,
      loading: false,
      data: [dali],
      request: null
    },
    dispatch: sinon.fake()
  }

  const RoutedPersonDetailPage = withMockRoute(PersonDetailPage)
  const outer = shallowWithIntl(<RoutedPersonDetailPage {...props} />)
  const wrapper = outer.dive()

  t.true(wrapper.exists('PersonDetail'))
  t.is(wrapper.find('PersonDetail').first().props().person, dali)

  // as I am no one there should be one button
  t.is(wrapper.find('Button').length, 1)
  t.true(wrapper.exists('IssueBadge'))
  t.true(wrapper.exists('#deletePersonBtn'))
  await wrapper.find('#deletePersonConfirm').first().props().onCancel()
  await wrapper.find('#deletePersonConfirm').first().props().onConfirm(dali)
  t.is(props.dispatch.callCount, 1)
})

test('render Dalis PersonDetailPage as self dali', async t => {
  const dali = people[1]
  const props = {
    ...t.context.store,
    me: dali,
    isNew: false,
    personid: dali._id,
    people: {
      sync: true,
      syncing: false,
      loading: false,
      data: [dali],
      request: null
    },
    dispatch: sinon.fake()
  }

  const RoutedPersonDetailPage = withMockRoute(PersonDetailPage)
  const outer = shallowWithIntl(<RoutedPersonDetailPage {...props} />)
  const wrapper = outer.dive()

  t.true(wrapper.exists('PersonDetail'))
  t.is(wrapper.find('PersonDetail').first().props().person, dali)
  let personDetail = wrapper.find('PersonDetail').first().dive()
  // as I am me there should be only an edit button
  // console.log(personDetail.debug())
  t.is(personDetail.find('Button').length, 1)
  t.true(personDetail.exists('#editPersonBtn'))

  // click the edit button
  const editPerson = personDetail.find('Button#editPersonBtn')
  editPerson.props().onClick()
  // we should now be in edit mode
  t.true(wrapper.exists('Connect(Form(WrappedWithAddressFinderComponent))'))
  // cancel the edit
  wrapper.find('Connect(Form(WrappedWithAddressFinderComponent))').first().props().onCancel()
  personDetail = wrapper.find('PersonDetail').first().dive()

  t.is(personDetail.find('Button').length, 1)

  // edit again
  editPerson.props().onClick()
  t.true(wrapper.exists('Connect(Form(WrappedWithAddressFinderComponent))'))
  // save the edit
  await wrapper.find('Connect(Form(WrappedWithAddressFinderComponent))').first().props().onSubmit(dali)
  personDetail = wrapper.find('PersonDetail').first().dive()
  t.true(personDetail.exists('#editPersonBtn'))
  t.is(props.dispatch.callCount, 1)
})

test('render new PersonDetailPage as admin ', async t => {
  const admin = people[0]
  const alice = people[2]
  const props = {
    ...t.context.store,
    me: admin,
    isNew: true,
    personid: null,
    people: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
    },
    dispatch: sinon.fake.returns([alice])
  }

  const RoutedPersonDetailPage = withMockRoute(PersonDetailPage)
  const outer = shallowWithIntl(<RoutedPersonDetailPage {...props} />)
  const router = outer.props().router
  router.back = sinon.fake()
  router.replace = sinon.fake()
  const wrapper = outer.dive()

  // we should start in edit mode
  t.true(wrapper.exists('Connect(Form(WrappedWithAddressFinderComponent))'))
  // cancel the edit
  wrapper.find('Connect(Form(WrappedWithAddressFinderComponent))').first().props().onCancel()
  t.is(router.back.callCount, 1)

  // save the edit
  await wrapper.find('Connect(Form(WrappedWithAddressFinderComponent))').first().props().onSubmit(alice)
  t.is(props.dispatch.callCount, 1)
  t.is(router.replace.lastArg, '/people')
})
