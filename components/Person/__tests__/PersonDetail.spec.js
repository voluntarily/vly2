import React from 'react'
import test from 'ava'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'
import objectid from 'objectid'
import people from '../../../server/api/person/__tests__/person.fixture'
import PersonDetail from '../PersonDetail'
import { ActivityContainer } from '../../VTheme/VTheme'
import { VBanner, ProfileBannerTitle } from '../../VTheme/Profile'
import * as nextRouter from 'next/router'
import sinon from 'sinon'

test.before('Setup People fixtures', (t) => {
  // not using mongo or server here so faking ids
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]

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
})

test('render person details', t => {
  const wrapper = renderWithIntl(<PersonDetail person={t.context.me} />)
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), t.context.me.name)
  t.truthy(wrapper.find(ActivityContainer))
  t.truthy(wrapper.find(VBanner))
  t.is(wrapper.find(ProfileBannerTitle).length, 1)
})
