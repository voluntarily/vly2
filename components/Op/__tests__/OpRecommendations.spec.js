import React from 'react'
import test from 'ava'
import OpRecommendations from '../OpRecommendations'
import ops from './Op.fixture'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
const originalWarn = console.warn

test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    originalWarn(...args)
  }
})

test.after.always(() => {
  console.warn = originalWarn
})

test.serial('ensure recommendations component renders all locations when provided', t => {
  const recommendations = {
    basedOnSkills: [],
    basedOnLocation: ops
  }
  const wrapper = mountWithIntl(<OpRecommendations type='ask' recommendedOps={recommendations} />)
  const numOpCards = wrapper.find('OpCard').length
  t.is(wrapper.find('h3').length, 1)
  t.is(wrapper.find('h3').first().text(), 'Based on your locations')
  t.is(numOpCards, ops.length)
})

test.serial('ensure recommendations component renders all recommendations on skills when provided', t => {
  const recommendations = {
    basedOnSkills: ops,
    basedOnLocation: []
  }
  const wrapper = mountWithIntl(<OpRecommendations type='ask' recommendedOps={recommendations} />)
  const numOpCards = wrapper.find('OpCard').length
  t.is(wrapper.find('h3').length, 1)
  t.is(wrapper.find('h3').first().text(), 'Based on your preferences')
  t.is(numOpCards, ops.length)
})

test.serial('ensure recommendations component renders all recommendations on skills and locations when provided', t => {
  const recommendations = {
    basedOnLocation: ops.slice(0, 3),
    basedOnSkills: ops.slice(3, 5)
  }
  const wrapper = mountWithIntl(<OpRecommendations type='ask' recommendedOps={recommendations} />)
  const numOpCards = wrapper.find('OpCard').length
  t.is(wrapper.find('h3').length, 2)
  t.is(numOpCards, ops.length)
})

test.serial('ensure recommendations renders correctly with no matching locations or skills', t => {
  const recommendations = {
    basedOnSkills: [],
    basedOnLocation: []
  }
  const wrapper = mountWithIntl(<OpRecommendations type='ask' recommendedOps={recommendations} />)
  const numOpCards = wrapper.find('OpCard').length
  t.is(wrapper.find('h3').length, 0)
  t.is(numOpCards, 0)
})
