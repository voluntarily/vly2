import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import { FormattedMessage } from 'react-intl'
import Header from '../../components/Header/Header'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import withMockRoute from '../../server/util/mockRouter'

test('renders the header properly', t => {
  const RoutedHeader = withMockRoute(Header, '/')
  const wrapper = shallow(
    <RoutedHeader isAuthenticated={false} />
  )

  t.truthy(wrapper.find('Link').first().containsMatchingElement(<FormattedMessage id='siteTitle' />))
  // t.is(wrapper.find('a').length, 2);
  t.snapshot()
})

test.only('renders the Header and Navigation properly', t => {
  const RoutedHeader = withMockRoute(Header, '/about')

  const wrapper = mountWithIntl(
    <RoutedHeader isAuthenticated={false} />
  )

  t.truthy(wrapper.find('Link').first().containsMatchingElement(<img />))
  t.is(wrapper.find('a').length, 4)
  t.is(wrapper.find('a').last().text(), 'Sign In')
  t.snapshot()
})
