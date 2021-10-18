/** Test that the makeInterests.fixture makes the right sort of interests
 * Component side fixtures include _ids and are structured as if
 * they had been full populated by the api.
 */

import test from 'ava'
import { makeInterests, makeInterestedVolunteer } from './makeInterests.fixture.js'
import { InterestStatus } from '../../../server/api/interest/interest.constants'
const { INVITED, INTERESTED, COMMITTED, DECLINED } = InterestStatus

test('makeInterestedVolunteer creates a valid volunteer interest record', t => {
  const ip = makeInterestedVolunteer('testy', INTERESTED)
  t.is(ip.status, INTERESTED)
  t.true(ip.person.role.includes('volunteer'))
  t.true(ip.opportunity.requestor.role.includes('opportunityProvider'))
  t.true(ip.messages.length > 0)
  t.true(ip.messages[0].author.name.length > 0)
})

test('makeInterestedVolunteer creates a valid volunteer invited record', t => {
  const ip = makeInterestedVolunteer('testy', INVITED)
  t.is(ip.status, INVITED)
})

const InterestStatusCheck = [INTERESTED, INVITED, COMMITTED, DECLINED]

test('makeInterests creates a valid set of volunteer interest records', t => {
  const ips = makeInterests('testy', 5)
  t.is(ips.length, 5)
  ips.forEach(ip => {
    t.true(InterestStatusCheck.includes(ip.status))
  })
})
