import test from 'ava'
import filterValidSchoolRecords from '../filter-valid-school-records'

test('empty email domains should be removed', (t) => {
  t.deepEqual(
    filterValidSchoolRecords([{ emailDomain: '' }]),
    [],
    'Schools with empty email domain fields should be removed'
  )
})

test('allowed email domain does not get filtered out', (t) => {
  t.deepEqual(
    filterValidSchoolRecords([{ emailDomain: 'test.school.nz' }]),
    [{ emailDomain: 'test.school.nz' }],
    'Schools with email domains that are in allow list should not be removed'
  )
})

test('email domains that don\'t match allow list should be removed', (t) => {
  t.deepEqual(
    filterValidSchoolRecords([{ emailDomain: 'example.com' }]),
    [],
    'Schools with email domains that aren\'t in allow list should be removed'
  )
})

test('multiple item array filters correct schools', (t) => {
  t.deepEqual(
    filterValidSchoolRecords([{ emailDomain: 'example.com' }, { emailDomain: 'test.school.nz' }]),
    [{ emailDomain: 'test.school.nz' }],
    'Only invalid email domains should be filtered out'
  )
})
