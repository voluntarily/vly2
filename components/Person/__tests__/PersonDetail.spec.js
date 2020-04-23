import test from 'ava'
import * as nextRouter from 'next/router'
import objectid from 'objectid'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import sinon from 'sinon'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'
import people from '../../../server/api/person/__tests__/person.fixture'
import { ProfileBannerTitle, VBanner } from '../../VTheme/Profile'
import { ActivityContainer } from '../../VTheme/VTheme'
import PersonDetail from '../PersonDetail'
import thunk from 'redux-thunk'

test.before('Setup People fixtures', (t) => {
  // not using mongo or server here so faking ids
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]
  me.job = 'I have a job'
  me.placeOfWork = 'I have a place of work'
  me.facebook = 'facebooker'
  me.twitter = 'twitter'
  me.about = '<h1>About Me</h1>'
  me.orgFollowership = [
    {
      _id: 'as3489398434',
      person: me,
      organisation: {
        _id: '1231453451',
        name: 'test org',
        imgUrl: 'https://example.com/img.png'
      },
      status: 'follow'
    }
  ]
  me.orgMembership = [
    {
      _id: 'as3489398434',
      person: me,
      organisation: {
        _id: '1231453451',
        name: 'test org',
        imgUrl: 'https://example.com/img.png'
      },
      status: 'member'
    }
  ]
  me.education = 'Some College'

  t.context = {
    me,
    people
  }

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
      }
    }
  )
})

test('render person details as other person', t => {
  const wrapper = renderWithIntl(
    <PersonDetail person={t.context.me} />
  )
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), t.context.me.name)
  t.truthy(wrapper.find(ActivityContainer))
  t.truthy(wrapper.find(VBanner))
  t.is(wrapper.find(ProfileBannerTitle).length, 1)
})

test('render person details as self', t => {
  const panelEdit = sinon.fake()
  const personEdit = sinon.fake()
  const wrapper = renderWithIntl(
    <Provider store={t.context.mockStore}>

      <PersonDetail
        person={t.context.me}
        canEdit
        panelEdit={panelEdit}
        personEdit={personEdit}

      />
    </Provider>

  )
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').first().text(), t.context.me.name)
  t.is(wrapper.find('h1').last().text(), 'How do you want to use Voluntarily?')
  t.truthy(wrapper.find(ActivityContainer))
  t.truthy(wrapper.find(VBanner))
  t.is(wrapper.find(ProfileBannerTitle).length, 1)
})
