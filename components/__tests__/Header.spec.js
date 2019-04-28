import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import { FormattedMessage } from 'react-intl'
import Header from '../../components/Header/Header'
import { mountWithIntl } from '../../lib/react-intl-test-helper'

test('renders the header properly', t => {
  const wrapper = shallow(
    <Header />
  )

  t.truthy(wrapper.find('Link').first().containsMatchingElement(<FormattedMessage id='siteTitle' />))
  // t.is(wrapper.find('a').length, 2);
  t.snapshot()
})

test('renders the Header and Navigation properly', t => {
  const props = {
    router: {
      pathname: 'about'
    }
  }
  const wrapper = mountWithIntl(
    <Header {...props} />
  )

  t.truthy(wrapper.find('Link').first().containsMatchingElement(<FormattedMessage id='siteTitle' />))
  // t.is(wrapper.find('a').length, 2);
  t.snapshot()
})
