import React from 'react'
import test from 'ava'
import { mount } from 'enzyme'
import { SponsorContainer, SponsorIcon } from '../Partners'

// Initial opportunities added into test db

test('Test sponsor renders', t => {
  const wrapper = mount(
    <SponsorContainer>
      <SponsorIcon src='../../../../public/static/img/partners/Spark.png' />
    </SponsorContainer>
  )
  t.truthy(wrapper.find('img'))
})
