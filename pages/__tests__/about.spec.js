import React from 'react'
import test from 'ava'
import { shallow, render } from 'enzyme'
import { intl } from '../../lib/react-intl-test-helper'
import { AboutTest } from '../about/about'

const intlPropEn = { ...intl, locale: 'en', enabledLanguages: ['en', 'mi'] }
const intlPropMi = { ...intl, locale: 'mi', enabledLanguages: ['en', 'mi'] }

test('shallow render EN', t => {
  const wrapper = shallow(<AboutTest intl={intlPropEn} />)
  t.regex(wrapper.find('Markdown').first().children().text(), new RegExp('.*# About Voluntari.ly.*'))
})

test('shallow render MI', t => {
  const wrapper = shallow(<AboutTest intl={intlPropMi} />)
  t.regex(wrapper.find('Markdown').first().children().text(), new RegExp('.*Kei te hangaia.*'))
})

test('render EN', t => {
  const wrapper = render(<AboutTest intl={intlPropEn} />)
  // console.log(wrapper.html())
  t.is(wrapper.find('h1').first().text(), 'About Voluntari.ly')
  t.regex(wrapper.find('p').first().text(), new RegExp('We are building a.*'))
})

test.only('render MI', t => {
  const wrapper = render(<AboutTest intl={intlPropMi} />)
  // console.log(wrapper.html())
  t.is(wrapper.find('h1').first().text(), 'About Voluntari.ly')
  t.regex(wrapper.find('p').first().text(), new RegExp('.*Kei te hangaia.*'))
})
