import React from 'react'
import test from 'ava'
import { mount } from 'enzyme'
import Hero2 from '../Hero2'

// Initial opportunities added into test db

test('shallow hero header seciton', t => {
  const wrapper = mount(
    <Hero2
      subheader='Voluntarily for Teachers'
      title='Get industry volunteers to help teachers and students in your school.'
    />
  )
  t.is(wrapper.find('p').text(), 'Voluntarily for Teachers')
  t.is(wrapper.find('h1').text(), 'Get industry volunteers to help teachers and students in your school.')
})
