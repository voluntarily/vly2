import React from 'react'
import test from 'ava'
import OpRecommendations from '../OpRecommendations'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
const originalWarn = console.warn
const ops = require('../../../server/api/opportunity/__tests__/opportunity.fixture')

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
  const wrapper = mountWithIntl(<OpRecommendations recommendedOps={recommendations} />)

  const numOpCards = wrapper.find('OpCard').length
  t.is(numOpCards, ops.length)
})

test.serial('ensure recommendations renders correctly with no matching locations', t => {
  const recommendations = {
    basedOnSkills: [],
    basedOnLocation: []
  }
  const wrapper = mountWithIntl(<OpRecommendations recommendedOps={recommendations} />)

  const numOpCards = wrapper.find('OpCard').length
  t.is(numOpCards, 0)
})
