import test from 'ava'
import { PersonBadgeSection } from '../PersonBadge'
import mockFetch from 'fetch-mock'
import { mount } from 'enzyme'
import { APP_URL } from '../../../lib/apiCaller'

const badgeData = [{
  badgeclass: 'cqNQRgBaTVagim095Pldsw',
  badgeclassOpenBadgeId: 'https://api.badgr.io/public/badges/cqNQRgBaTVagim095Pldsw',
  createdAt: '2019-09-25T04:34:20.433Z',
  entityId: 'RNfvE7cCSYqpTHzGHW2Wsw',
  entityType: 'Assertion',
  image: 'https://media.badgr.io/uploads/badges/assertion-RNfvE7cCSYqpTHzGHW2Wsw.png',
  issuedOn: '2019-09-25T04:34:20.075Z',
  issuer: 'aSBVfm84SMiF0c16O9jCOA',
  issuerOpenBadgeId: 'https://api.badgr.io/public/issuers/aSBVfm84SMiF0c16O9jCOA',
  person: '5d78128b573e3f35a8e44248',
  __v: 0,
  _id: '5d8aee4a7b67783aa03b1a5a'
}]

test('PersonBadge renders properly', async t => {
  const mockServer = mockFetch.sandbox()
  mockServer.get(`begin:${APP_URL}/api/badge`, { body: [ ...badgeData ] })
  const person = {
    _id: 'taskldjfh0'
  }
  global.fetch = mockServer
  const PersonBadgeRendered = mount(<PersonBadgeSection person={person} />)
  t.falsy(PersonBadgeRendered.isEmpty())
})
