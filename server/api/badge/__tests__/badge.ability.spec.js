import test from 'ava'
import request from 'supertest'
import { server, appReady } from '../../../server'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import Person from '../../person/person'
import people from '../../person/__tests__/person.fixture'
import { jwtData } from '../../../middleware/session/__tests__/setSession.fixture'
import Badge from '../badge'
import fetchMock from 'fetch-mock'
import badges from './badges.fixture'
import { config } from '../../../../config/serverConfig'

const { BADGR_API } = config

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  await appReady
})

test.beforeEach('populate fixtures', async (t) => {
  t.context.people = await Person.create(people)
})

test.afterEach.always(async () => {
  await Promise.all([
    Badge.deleteMany(),
    Person.deleteMany()
  ])
})

test.serial('Badge API - list all badges', async t => {
  const mockedFetch = fetchMock.sandbox()
    .post(`begin:${BADGR_API}/o/token`, { body: { access_token: '123456789' } })
    .get(`begin:${BADGR_API}/v2/badgeclasses`, { body: { result: badges } })

  const originalFetch = global.fetch
  global.fetch = mockedFetch

  const response = await request(server)
    .get('/api/badges')
    .set('Accept', 'application/json')

  t.is(response.status, 200)

  global.fetch = originalFetch
})

test.serial('Badge API - list user\'s badges', async t => {
  const badgeUser = t.context.people[0]
  const issuedBadges = badges.map(badge => {
    return {
      ...badge,
      badgeclass: '???',
      badgeclassOpenBadgeId: '???',
      person: badgeUser._id
    }
  })

  await Badge.create(issuedBadges)

  const response = await request(server)
    .get(`/api/badge/${badgeUser._id}`)
    .set('Accept', 'application/json')

  t.is(response.status, 200)
})

test.serial('Badge API - create - anon', async t => {
  const badgeToIssue = badges[0]
  const personToIssueBadgeTo = t.context.people[0]

  const response = await request(server)
    .post(`/api/badge/${badgeToIssue.entityId}`)
    .set('Accept', 'application/json')
    .send({
      email: personToIssueBadgeTo.email,
      _id: personToIssueBadgeTo._id
    })

  t.is(response.status, 403)
})

test.serial('Badge API - create - admin', async t => {
  const mockedFetch = fetchMock.sandbox()
    .post(`begin:${BADGR_API}/o/token`, { body: { access_token: '123456789' } })
    .post(
      `begin:${BADGR_API}/v2/badgeclasses`,
      {
        body: {
          result: [{
            entityType: 'Assertion',
            entityId: 'WDVAtNTfT_S8JuO-u8rVEw',
            openBadgeId: `${BADGR_API}/public/assertions/WDVAtNTfT_S8JuO-u8rVEw`,
            createdAt: '2019-09-12T04:33:37.129885Z',
            createdBy: 'ZR_9B1v2S2OHJ9UoFIs5vw',
            badgeclass: 'HhIer_mgTtahY6TRT22L5A',
            badgeclassOpenBadgeId: `${BADGR_API}/public/badges/HhIer_mgTtahY6TRT22L5A`,
            issuer: 'aSBVfm84SMiF0c16O9jCOA',
            issuerOpenBadgeId: `${BADGR_API}/public/issuers/aSBVfm84SMiF0c16O9jCOA`,
            image: 'https://media.badgr.io/uploads/badges/assertion-WDVAtNTfT_S8JuO-u8rVEw.png',
            recipient: {
              identity: 'sha256$cc37fd25e8687b0c8adbd743f7e43997a0d5eb279b5eea11b7d5787f7b0f5842',
              hashed: true,
              type: 'email',
              plaintextIdentity: 'andrew@omgtech.co.nz',
              salt: 'dc5af5ab2e8e456daaf80b5352741a82'
            },
            issuedOn: '2019-09-12T04:33:36.761207Z',
            narrative: null,
            evidence: [],
            revoked: false,
            revocationReason: null,
            expires: null,
            extensions: {}
          }]
        }
      }
    )

  const badgeToIssue = badges[0]
  const personToIssueBadgeTo = t.context.people[0]

  const originalFetch = global.fetch
  global.fetch = mockedFetch

  const response = await request(server)
    .post(`/api/badge/${badgeToIssue.entityId}`)
    .set('Accept', 'application/json')
    .set('Cookie', [`idToken=${jwtData.idToken}`])
    .send({
      email: personToIssueBadgeTo.email,
      _id: personToIssueBadgeTo._id
    })

  t.is(response.status, 200)

  global.fetch = originalFetch
})
