import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import PersonList from '../PersonList'
import objectid from 'objectid'
import people from '../../../server/api/person/__tests__/person.fixture'

test.before('Setup People fixtures', (t) => {
  // not using mongo or server here so faking ids
  people.forEach(p => { p._id = objectid().toString() })
  const me = people[0]

  t.context = {
    me,
    people
  }
})

test('renders the list', t => {
  const wrapper = shallow(
    <PersonList people={t.context.people} />
  )

  t.is(wrapper.find('PersonListItem').length, 8)
})

test('renders no people', t => {
  const wrapper = shallow(
    <PersonList />
  )

  t.is(wrapper.find('PersonListItem').length, 0)
  t.is(wrapper.text(), 'No Matching People')
})
