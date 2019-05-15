import React from 'react'
import { Container } from 'next/app'
import test from 'ava'
import { mount } from 'enzyme'
import OpListSection from '../OpListSection'
import withRedux from 'next-redux-wrapper'
import { makeStore } from '../../../lib/redux/reduxApi'
import { Provider } from 'react-redux'

// Initial opportunities added into test db
const ops = [
  {
    _id: '5cc903e5f94141437622cea7',
    title: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    status: 'draft'
  },
  {
    _id: '5cc903e5f94141437622ce87',
    title: 'The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: 'Albany, Auckland',
    status: 'draft'
  }
]

test.only('mount the list with ops', t => {
  const wrapper = mount(
    withRedux(makeStore, { debug: true })(
      <Container>
        <Provider store={this.props.store}>
          <OpListSection handleShowOp={() => {}} handleDeleteOp={() => {}} />
        </Provider>
      </Container>
    )
  )

  console.log(wrapper.html())
  t.is(wrapper.find('OpListSection').length, 1)
})
