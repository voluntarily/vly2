
import { Landscape, Portrait } from '../../components/VTheme/VTheme'
import InterestTable from '../../components/Interest/InterestTable'
import cuid from 'cuid'
import { InterestStatus } from '../../server/api/interest/interest.constants'
import fetch from 'isomorphic-fetch'
import { useState, useEffect } from 'react'
import { InputNumber } from 'antd'
import moment from 'moment'

const fetchRandomUsers = async (numPeople) => {
  try {
    const url = `https://randomuser.me/api/?results=${numPeople}`
    const response = await fetch(url)

    if (response.ok) {
      const json = await response.json()
      return json.results
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

const getPeople = async (numPeople) => {
  const users = await fetchRandomUsers(numPeople)
  return users.map(person => {
    return ({
      _id: cuid(),
      name: `${person.name.first} ${person.name.last}`,
      nickname: person.login.username,
      imgUrl: person.picture.medium,
      imgUrlSm: person.picture.thumbnail,
      email: person.email
    })
  })
}

const { INVITED, INTERESTED, COMMITTED, DECLINED } = InterestStatus
const InterestStatusFeed = [INTERESTED, INVITED, COMMITTED, DECLINED]
const opid = cuid()
const getRandomArbitrary = (min, max) => { return Math.random() * (max - min) + min }
const coin = (a, b) => { return (Math.random() * 2) > 1 ? a : b }

const makeMessages = (numMessages, a, b, status, op) =>
  Array(numMessages).fill({}).map((item, index) => ({
    body: coin(`Example message ${a.name} is ${status} in ${op.name}`, 'Thanks for the feedback, I will be in touch'),
    author: coin(a, b),
    createdAt: moment().subtract(getRandomArbitrary(5, 1200), 'minutes')
  }))

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
    const status = InterestStatusFeed[index % InterestStatusFeed.length]
    const interest = {
      _id: cuid(),
      person: people[index + 1],
      opportunity,
      status,
      messages: makeMessages(4, people[index + 1], requestor, status, opportunity),
      termsAccepted: true
    }
    return interest
  })
  return interests
}

const TestPublicPage = ({ locale, session, isAuthenticated }) => {
  const [numInterests, setNumInterests] = useState(5)
  const [interests, setInterests] = useState([])
  const [actionList, setActionList] = useState(['Action results here'])

  const handleAction = (action, interest) => {
    console.log('handleAction', action, interest)
    setActionList(actionList.concat(`${action} - ${interest.person.name} ${interest.messages.slice(-1)[0].body}`))
  }

  useEffect(() => {
    getInterests(numInterests).then(interests => setInterests(interests))
  }, [numInterests])
  return (
    <>
      <Portrait>
        <h1>Opportunity Interested Volunteers Table</h1>
        <section>
          <label>Number of Interested Volunteers: </label>
          <InputNumber
            min={1} max={20} defaultValue={numInterests}
            onChange={(value) => setNumInterests(value)}
          />
        </section>
      </Portrait>
      <Landscape>
        <InterestTable
          onAction={handleAction}
          interests={interests}
        />
        <pre>{JSON.stringify(actionList, null, 2)}</pre>

        {/* <pre>{JSON.stringify(interests, null, 2)}</pre> */}
      </Landscape>
    </>

  )
}
export default TestPublicPage
