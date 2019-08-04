import React from 'react'
import test from 'ava'
import OpRecommendations from '../OpRecommendations'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
const originalWarn = console.warn

const { regions } = require('../../../server/api/location/locationData')
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

const user = {
  location: 'Auckland'
}

test('ensure recommendations component renders all matching locations', t => {
  const wrapper = mountWithIntl(<OpRecommendations locations={regions} me={user} ops={ops} />)

  const matchingRegion = regions.find(r => r.name === user.location)
  const matchingLocations = [ matchingRegion.name, ...matchingRegion.containedTerritories ]
  const numberOfMatchingOps = ops.filter(op => matchingLocations.includes(op.location)).length

  const numOpCards = wrapper.find('OpCard').length
  t.is(numOpCards, numberOfMatchingOps)
})

test('ensure closest location is shown first', t => {
  const me = {
    location: 'North Shore City'
  }

  const fakeRegions = [
    {
      name: 'Auckland',
      containedTerritories: ['North Shore City', 'Central Auckland', 'West Auckland']
    }
  ]

  const fakeOps = [
    {
      ...ops[0],
      location: 'Auckland'
    },
    {
      ...ops[1],
      location: 'West Auckland'
    },
    {
      ...ops[2],
      location: 'North Shore City'
    }
  ]

  const wrapper = mountWithIntl(<OpRecommendations locations={fakeRegions} me={me} ops={fakeOps} />)

  const opCardProps = wrapper.find('OpCard').first().instance().props
  // since north shore city is closest to the user, should be shown first
  t.is(opCardProps.op, fakeOps[2])
})

test('ensure user without location renders properly', t => {
  const me = {}

  const fakeRegions = [
    {
      name: 'Auckland',
      containedTerritories: ['North Shore City', 'Central Auckland', 'West Auckland']
    }
  ]

  const fakeOps = [
    {
      ...ops[0],
      location: 'Auckland'
    },
    {
      ...ops[1],
      location: 'West Auckland'
    },
    {
      ...ops[2],
      location: 'North Shore City'
    }
  ]

  const wrapper = mountWithIntl(<OpRecommendations locations={fakeRegions} me={me} ops={fakeOps} />)

  t.is(wrapper.find('OpList').length, 0)
})

test('ensure user without any matching location renders properly', t => {
  const me = {
    location: 'North Shore City'
  }

  const fakeRegions = [
    {
      name: 'Auckland',
      containedTerritories: ['North Shore City', 'Central Auckland', 'West Auckland']
    },
    {
      name: 'Otago',
      containedTerritories: [
        'Central Otago District',
        'Queenstown-Lakes District',
        'Dunedin City',
        'Clutha District'
      ]
    }
  ]

  const fakeOps = [
    {
      ...ops[0],
      location: 'Central Otago District'
    },
    {
      ...ops[1],
      location: 'Queenstown-Lakes District'
    },
    {
      ...ops[2],
      location: 'Dunedin City'
    }
  ]

  const wrapper = mountWithIntl(<OpRecommendations locations={fakeRegions} me={me} ops={fakeOps} />)

  t.is(wrapper.find('OpList').length, 0)
})
