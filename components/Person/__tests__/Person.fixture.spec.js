/** Test that the person.fixture makes the right sort of people
 * Component side fixtures include _ids and are structured as if
 * they had been full populated by the api.
 */

import test from 'ava'
import { range, gra, makeVolunteer, makeTeacher, makeVolunteers } from './makePeople.fixture.js'

test('range generates an arithmetic sequence', t => {
  const sum = arr => arr.reduce((acc, i) => acc + i)
  let seq = range(0, 9, 1)
  t.is(seq.length, 10)
  t.is(sum(seq), (seq[0] + seq.slice(-1)[0]) / 2 * seq.length)

  seq = range(10, 20, 1)
  t.is(seq.length, 11)
  t.is(sum(seq), (seq[0] + seq.slice(-1)[0]) / 2 * seq.length)
  t.is(sum(seq), 165)

  seq = range(10, 20, 2)
  t.is(seq.length, 6)
  t.is(sum(seq), (seq[0] + seq.slice(-1)[0]) / 2 * seq.length)
  t.is(sum(seq), 90)
})

test('gra gets a random integer in range', t => {
  range(0, 9, 1).forEach(item => {
    let rnd = gra(0, 2) // gra is inclusive
    t.true(range(0, 2, 1).includes(rnd))

    rnd = gra(100, 150) // gra is inclusive
    t.true(range(100, 150, 1).includes(rnd))
  })
})

test('make volunteer creates a valid volunteer', t => {
  range(0, 5, 1).forEach(item => {
    const vp = makeVolunteer(`testy${item}`)
    t.true(vp.name.includes('volunteer'))
    t.true(vp.role.includes('volunteer'))

    t.true(['he', 'she', 'they'].includes(vp.pronoun.subject))
  })
})

test('make teacher creates a valid teacher', t => {
  range(0, 5, 1).forEach(item => {
    const vp = makeTeacher(`teacher${item}`)
    t.true(vp.name.includes('opportunityProvider'))
    t.true(['he', 'she', 'they'].includes(vp.pronoun.subject))
  })
})

test('make volunteers creates unique list of volunteers', t => {
  const vps = makeVolunteers('test', 5)
  t.is(vps.length, 5)
  const emails = vps.map(vp => vp.email)
  t.is(new Set(emails).size, emails.length)
})
