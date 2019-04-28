import React from 'react'
import PropTypes from 'prop-types'
import test from 'ava'
import sinon from 'sinon'
import { mount, render } from 'enzyme'
import configureStore from 'redux-mock-store'
import { intlShape, IntlProvider } from 'react-intl'
import { intl } from '../../../util/react-intl-test-helper'
import About from '../About'

const intlPropEn = { ...intl, locale: 'en', enabledLanguages: ['en', 'mi'] }
const mockStoreEn = configureStore()({
  intl: intlPropEn
})

test('renders full page in english', t => {
  const wrapper = render(
    <IntlProvider><About /></IntlProvider>,
    {
      context: {
        store: mockStoreEn
      },
      childContextTypes: {
        store: mockStoreEn
      }
    }
  )
  // console.log(wrapper.html());
  t.is(wrapper.find('h1').first().text(), 'About Voluntari.ly')
  t.regex(wrapper.find('p').first().text(), new RegExp('We are building a.*'))
})

const intlPropMi = { ...intl, locale: 'mi', enabledLanguages: ['en', 'mi'] }
const mockStoreMi = configureStore()({
  intl: intlPropMi
})
test('renders full page in Māori', t => {
  const wrapper = render(
    <IntlProvider><About /></IntlProvider>,
    {
      context: {
        store: mockStoreMi
      },
      childContextTypes: {
        store: mockStoreMi
      }
    }
  )

  t.is(wrapper.find('h1').first().text(), 'About Voluntari.ly')
  t.regex(wrapper.find('p').first().text(), new RegExp('Kei te hangaia e mātou.*'))
})

test('calls componentDidMount', t => {
  sinon.spy(About.prototype, 'componentDidMount')
  mount(
    <About />,
    {
      context: {
        router: {
          isActive: sinon.stub().returns(true),
          push: sinon.stub(),
          replace: sinon.stub(),
          go: sinon.stub(),
          goBack: sinon.stub(),
          goForward: sinon.stub(),
          setRouteLeaveHook: sinon.stub(),
          createHref: sinon.stub()
        },
        intl,
        store: mockStoreEn
      },
      childContextTypes: {
        router: PropTypes.object,
        intl: intlShape,
        store: mockStoreEn
      }
    }
  )

  t.truthy(About.prototype.componentDidMount.calledOnce)
  About.prototype.componentDidMount.restore()
})
