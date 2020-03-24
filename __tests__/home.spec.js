import test from 'ava'
import { PersonHomePage } from '../pages/home/home'
import { mountWithIntl } from '../lib/react-intl-test-helper'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import objectid from 'objectid'
import ops from '../server/api/opportunity/__tests__/opportunity.fixture'
import people from '../server/api/person/__tests__/person.fixture'
import archivedOpportunities from '../server/api/archivedOpportunity/__tests__/archivedOpportunity.fixture'
import tags from '../server/api/tag/__tests__/tag.fixture'
import orgs from '../server/api/organisation/__tests__/organisation.fixture'
import goals from '../server/api/goal/__tests__/goal.fixture'
import { PersonalGoalStatus } from '../server/api/personalGoal/personalGoal.constants'
import fetchMock from 'fetch-mock'
import { InterestStatus } from '../server/api/interest/interest.constants'
import { MemberStatus } from '../server/api/member/member.constants'
import reduxApi from '../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import thunk from 'redux-thunk'
import { MockWindowScrollTo } from '../server/util/mock-dom-helpers'
import sinon from 'sinon'
import * as nextRouter from 'next/router'

MockWindowScrollTo.replaceForTest(test, global)

const { sortedLocations, regions } = require('../server/api/location/locationData')
test.before('Setup Route', (t) => {
  const router = () => {
    return ({
      pathname: '/home',
      route: '/home',
      asPath: '/home',
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
  // not using mongo or server here so faking ids
  people.map(p => { p._id = objectid().toString() })
  orgs.map(p => { p._id = objectid().toString() })
  goals.map(p => { p._id = objectid().toString() })

  const me = people[0]
  // setup list of opportunities, I am owner for the first one
  ops.map((op, index) => {
    op._id = objectid().toString()
    op.requestor = people[index]
  })
  // take ownership of 2nd event
  archivedOpportunities.map((op, index) => {
    op._id = objectid().toString()
    op.requestor = me._id
  })

  // setup list of interests, i'm interested in first 5 ops except the one for which I am requestor
  const interestStates = ['interested', 'invited', 'committed', 'declined', 'completed', 'cancelled']
  const interests = ops.filter(op => op.requestor._id !== me._id).map((op, index) => {
    return ({
      _id: objectid().toString(),
      person: me._id,
      opportunity: op,
      comment: `${index}: ${me.nickname} is interested in ${op.name}`,
      status: index < interestStates.length ? interestStates[index] : 'interested'
    })
  })
  // This fixture is not used elsewhere, thus it's created here
  const archivedInterestFixture = [
    {
      _id: objectid().toString(),
      person: 'a',
      opportunity: 'my op',
      status: InterestStatus.INTERESTED,
      comment: 'Interested'
    },
    {
      _id: objectid().toString(),
      person: me._id,
      opportunity: archivedOpportunities[2],
      status: InterestStatus.COMMITTED,
      comment: 'Committed'
    },
    {
      _id: objectid().toString(),
      person: me._id,
      opportunity: archivedOpportunities[3],
      status: InterestStatus.NOTATTENDED,
      comment: 'Not Attended'
    },
    {
      _id: objectid().toString(),
      person: me._id,
      opportunity: archivedOpportunities[4],
      status: InterestStatus.ATTENDED,
      comment: 'Attended'
    }
  ]

  const recommendedOps = {
    basedOnLocation: [ops[0], ops[1]],
    basedOnSkills: [ops[2], ops[3]]
  }

  // Initial members added into test db
  const members = [
    {
      _id: objectid().toString(),
      person: people[0]._id,
      organisation: orgs[0],
      validation: 'test follower',
      status: MemberStatus.FOLLOWER
    },
    // person 1 is member of two orgs
    // org 1 has two members
    {
      _id: objectid().toString(),
      person: people[1]._id,
      organisation: orgs[0],
      validation: 'test member 1',
      status: MemberStatus.MEMBER
    },
    {
      _id: objectid().toString(),
      person: people[1]._id,
      organisation: orgs[1],
      validation: 'test member 1',
      status: MemberStatus.MEMBER
    },
    {
      _id: objectid().toString(),
      person: people[3]._id,
      organisation: orgs[1],
      validation: 'test member 3',
      status: MemberStatus.MEMBER
    }
  ]
  const personalGoals = [
    {
      person: me._id,
      goal: goals[0],
      status: PersonalGoalStatus.QUEUED
    }
  ]

  t.context = {
    me,
    people,
    ops,
    archivedOpportunities,
    interests,
    recommendedOps,
    tags,
    orgs,
    goals,
    personalGoals,
    members,
    archivedInterestFixture,
    locations: [
      {
        regions: regions,
        locations: sortedLocations
      }
    ]
  }
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer

  t.context.mockStore = configureStore([thunk])(
    {
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
      opportunities: {
        sync: true,
        syncing: false,
        loading: false,
        data: [ops[0]],
        request: null
      },
      interests: {
        sync: true,
        syncing: false,
        loading: false,
        data: t.context.interests,
        request: null
      },
      members: {
        sync: true,
        syncing: false,
        loading: false,
        data: t.context.members,
        request: null
      },
      interestArchives: {
        sync: true,
        syncing: false,
        loading: false,
        data: archivedInterestFixture,
        request: null
      },
      archivedOpportunities: {
        sync: true,
        syncing: false,
        loading: false,
        data: t.context.archivedOpportunities,
        request: null
      },
      recommendedOps: {
        sync: true,
        syncing: false,
        loading: false,
        data: [t.context.recommendedOps],
        request: null
      },
      locations: {
        data: t.context.locations
      },
      tags: {
        sync: true,
        syncing: false,
        loading: false,
        data: t.context.tags,
        request: null
      },
      goals: {
        sync: true,
        syncing: false,
        loading: false,
        data: t.context.goals,
        request: null
      },
      personalGoals: {
        sync: true,
        syncing: false,
        loading: false,
        data: t.context.personalGoals,
        request: null
      }
    }
  )
})

test.afterEach.always(t => t.context.mockServer.reset())

test.after.always(() => {

})
const tabIndex = {
  active: 0,
  discover: 1,
  history: 2,
  profile: 3
}

test.serial('run GetInitialProps', async t => {
  const me = t.context.people[0]
  t.context.mockServer
    .get(`path:/api/people/${me._id}`, { body: [me] })
    .get('path:/api/opportunities/', { body: [t.context.ops[0]] })
    .get('path:/api/interests/', { body: t.context.interests })
    .get('path:/api/personalGoals/', { body: t.context.personalGoals })
    .get('path:/api/archivedOpportunities/', { body: t.context.archivedOpportunities })
    .get('path:/api/members/', { body: t.context.members })
    .get('path:/api/opportunities/recommended', { body: [t.context.recommendedOps] })
    .get('path:/api/interestArchives/', { body: t.context.archivedInterestFixture })
  reduxApi.use('fetch', adapterFetch(t.context.mockServer))

  await PersonHomePage.getInitialProps({ store: t.context.mockStore })
  // 2 actions for each call and success
  t.is(t.context.mockStore.getActions().length, 16)
})

test('render volunteer home page - Active tab', t => {
  const props = {
    me: t.context.me
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePage {...props} />
    </Provider>)

  t.is(wrapper.find('h1').first().text(), 'Andrew Watkins')
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'Upcoming')
  t.is(wrapper.find('.ant-tabs-tabpane-active h2').at(1).text(), 'Your RequestsActivities you requested help from Volunteers with are listed below:')
  t.is(wrapper.find('.ant-tabs-tabpane-active h2').at(2).text(), 'Upcoming ActivitiesActivities you have offered to help out with are listed below:')

  const oplists = wrapper.find('OpList') // find 2 oplists on the home page
  t.is(oplists.length, 2)

  const cards1 = oplists.at(0).find('OpCard')
  t.is(cards1.length, 1)
  t.true(cards1.first().find('h1').first().text().includes(t.context.ops[0].name)) // Tests the name of the first archived op in the first oplist

  const cards2 = oplists.at(1).find('OpCard')
  t.is(cards2.length, 5)
  t.true(cards2.first().find('h1').first().text().includes(t.context.ops[1].name))
})

test('render volunteer home page - Discover tab', t => {
  const props = {
    me: t.context.me
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePage {...props} />
    </Provider>)
  wrapper.find('.ant-tabs-tab').at(tabIndex.discover).simulate('click')
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'Upcoming')
  const discoverPane = wrapper.find('.ant-tabs-tabpane-active').first()

  const oplists = discoverPane.find('OpList') // find 2 oplists on the home page
  t.is(oplists.length, 2)

  const cards1 = oplists.at(0).find('OpCard')
  t.is(cards1.length, 1)
  t.true(cards1.first().find('h1').first().text().includes(t.context.ops[0].name)) // find the first opcard in the first oplist
})

test.serial('render volunteer home page - History tab', t => {
  const props = {
    me: t.context.me
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePage {...props} />
    </Provider>)

  wrapper.find('.ant-tabs-tab').at(tabIndex.history).simulate('click')
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'History')

  const historyPane = wrapper.find('.ant-tabs-tabpane-active').first()
  t.is(historyPane.find('h2').first().text(), 'Completed Activities')
  t.is(historyPane.find('h2').at(1).text(), 'Cancelled Activities')
  t.is(historyPane.find('h2').at(2).text(), 'Attended Activities')

  const oplists = historyPane.find('OpList')
  t.is(oplists.length, 3) // The number of oplists on history tab

  const interestlists = historyPane.find('OpList')
  t.is(interestlists.length, 3) // The number of oplists on history tab

  const completedRequests = oplists.at(0)
  const cards1 = completedRequests.find('OpCard')
  t.is(cards1.length, 3) // Number of opcards in archivedops fixture
  t.true(cards1.first().find('h1').first().text().includes(t.context.archivedOpportunities[0].name)) // Tests the name of the first archived op in the first oplist

  const cancelledRequests = oplists.at(1)
  const cards2 = cancelledRequests.find('OpCard')
  t.is(cards2.length, 2)
  t.true(cards2.first().find('h1').first().text().includes(t.context.archivedOpportunities[3].name))

  const attendedRequests = interestlists.at(0)
  const cards3 = attendedRequests.find('OpCard')
  t.is(cards3.length, 3)
  // t.is(cards3.at(0).find('h1').first().text(), t.context.archivedInterestFixture[0].name)
})

test.serial('render volunteer home page - Profile tab', t => {
  t.context.mockServer
    .get(`path:/api/badge/${t.context.me._id}`, { body: [] })
    .get('path:/api/locations', { body: t.context.locations })
    .get('path:/api/tags/', { body: t.context.tags })

  const props = {
    me: t.context.me
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePage {...props} />
    </Provider>)
  wrapper.find('.ant-tabs-tab').at(tabIndex.profile).simulate('click')
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'Profile')
  const tab3 = wrapper.find('TabPane').at(tabIndex.profile)
  t.is(tab3.find('h1').first().text(), t.context.me.name)
})

test.serial('render Edit Profile ', async t => {
  t.context.mockServer
    .get(`path:/api/badge/${t.context.me._id}`, { body: [] })
    .get('path:/api/locations', { body: t.context.locations })
    .get('path:/api/tags/', { body: t.context.tags })
    .get('path:/api/education', { body: ['small', 'medium', 'large'] })
    .put(`path:/api/people/${t.context.me._id}`, {})

  const props = { me: t.context.me }
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePage {...props} />
    </Provider>)
  wrapper.find('.ant-tabs-tab').at(tabIndex.profile).simulate('click')
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'Profile')
  const profilePanel = wrapper.find('EditablePersonPanel').first()
  t.is(profilePanel.find('Button').first().text(), 'Edit')
  profilePanel.find('EditablePersonPanel Button').first().simulate('click')

  wrapper.find('EditablePersonPanel Button').first().simulate('click') // cancel edit
  wrapper.find('EditablePersonPanel Button').first().simulate('click') // edit again
  wrapper.find('Form').first().simulate('submit')
})
