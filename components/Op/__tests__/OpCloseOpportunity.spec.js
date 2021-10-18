import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { OpCloseOpportunity } from '../OpCloseOpportunity'
import sinon from 'sinon'
import * as nextRouter from 'next/router'

test.before('Setup Route for components that use useRouter', (t) => {
  t.context.router = {
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
  }

  sinon.replace(nextRouter, 'useRouter', () => { return t.context.router })
})

test('render OpCloseOpportunity ', t => {
  const dispatch = sinon.fake()
  const op = { _id: 'fakeid' }
  const wrapper = shallowWithIntl(<OpCloseOpportunity op={op} dispatch={dispatch} />)
  t.is(wrapper.find('h2').first().find('MemoizedFormattedMessage').props().defaultMessage, 'End Activity')
  const confirm = wrapper.find('#completedOpPopConfirm').first()
  confirm.props().onConfirm()
  t.true(dispatch.calledOnce)

  const cancelled = wrapper.find('#cancelOpPopConfirm').first()
  cancelled.props().onConfirm()
  t.true(dispatch.calledTwice)
})
