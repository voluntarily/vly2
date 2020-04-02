import React from 'react'
import { storiesOf } from '@storybook/react'
import InterestTable from '../InterestTable'
import sinon from 'sinon'
import cuid from 'cuid'
import { InterestStatus } from '../../../server/api/interest/interest.constants'
import fetch from 'isomorphic-fetch'

const getPeople = async (numPeople) => {
  const url = 'https://randomuser.me/api/?results=$numPeople'
  const res = await fetch(url)
  const people = res.body.results
  return people.map(person => {
    return ({
      _id: cuid(),
      name: `${person.name.first} ${person.name.last}`,
      nickname: person.login.username,
      imgUrl: person.picture.medium,
      imgUrlsm: person.picture.thumbnail,
      email: person.email
    })
  })
}

const { INVITED, INTERESTED, COMMITTED, DECLINED } = InterestStatus
const InterestStatusFeed = [INTERESTED, INVITED, COMMITTED, DECLINED]
const opid = cuid()

const getInterests = async (numInterests) => {
  const people = await getPeople(numInterests + 1)
  const requestor = people[0]
  const opportunity = {
    _id: opid,
    name: 'Test Opportunity',
    requestor: requestor,
    imgUrl: 'https://dog.ceo/api/breeds/image/random'
  }
  const interests = Array(numInterests).fill({}).map((item, index) => {
    const interest = {
      _id: cuid(),
      person: people[index + 1],
      opportunity,
      status: InterestStatusFeed[index % InterestStatusFeed.length],
      messages: [],
      termsAccepted: true
    }
    return interest
  })
  return interests
}

storiesOf('Interest Components', module)
  .add('InterestSection', () => {
    const handleInvite = sinon.spy()
    const handleWithdrawInvite = sinon.spy()
    const handleDecline = sinon.spy()
    getInterests(5).then(interests => {
      return (
        <InterestTable
          onInvite={handleInvite}
          onWithdrawInvite={handleWithdrawInvite}
          onDecline={handleDecline}
          interests={interests}
        />
      )
    })
  })
