import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import * as nextRouter from 'next/router'
import sinon from 'sinon'
import { UseRouter } from '../UseRouter'

test.before('Setup Route', (t) => {
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

test('renders shallow', t => {
  const wrapper = shallow(
    <UseRouter href='/'>
      Test Route
    </UseRouter>
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('dd').first().text(), '/test')
})
