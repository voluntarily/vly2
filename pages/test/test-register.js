
import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'
import RegisterInterestItem from '../../components/Interest/RegisterInterestItem'
import { useState } from 'react'
import cuid from 'cuid'
import { InterestStatus } from '../../server/api/interest/interest.constants'

const interests = [
  {
    _id: cuid(),
    person: { _id: cuid(), name: 'name', nickname: 'nickname' },
    opportunity: {
      _id: cuid(),
      name: 'Do Cool Stuff',
      requestor: {
        name: 'requestor',
        email: 'requestor@email.com'
      }
    },
    messages: [],
    status: null,
    termsAccepted: false
  },
  {
    _id: cuid(),
    person: { _id: cuid(), name: 'name', nickname: 'nickname' },
    opportunity: {
      _id: cuid(),
      name: 'Do Cool Stuff 2',
      requestor: {
        name: 'requestor',
        email: 'requestor@email.com'
      }
    },
    messages: [],
    status: InterestStatus.INVITED,
    termsAccepted: true
  }
]

// Returns the next status, given the current status
function getNextStatus (status) {
  switch (status) {
    case null:
      return InterestStatus.INTERESTED
    case InterestStatus.INTERESTED:
      return InterestStatus.INVITED
    case InterestStatus.INVITED:
      return InterestStatus.COMMITTED
    default:
      return status
  }
}

function getBackStatus (status) {
  switch (status) {
    case InterestStatus.INTERESTED:
      return null
    case InterestStatus.INVITED:
    case InterestStatus.COMMITTED:
      return InterestStatus.INTERESTED
    default:
      return status
  }
}

const TestPublicPage = ({ locale, session, isAuthenticated }) => {
  const [interest, setInterest] = useState(interests[1])

  const handleAccept = (msg, termsAccepted) => {
    setInterest({ ...interest, status: getNextStatus(interest.status) })
  }
  const handleReject = (msg) => {
    setInterest({ ...interest, status: getBackStatus(interest.status) })
  }
  return (
    <FullPage>
      <h1>Register Interest Item</h1>
      <RegisterInterestItem
        interest={interest}
        onAccept={handleAccept}
        onReject={handleReject}
      />

    </FullPage>
  )
}

export default publicPage(TestPublicPage)
