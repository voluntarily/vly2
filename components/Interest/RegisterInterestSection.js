/*
  Smart component. For the given op id and person id, it displays that person's interest in that op.
  If no interest exists, it will allow one to be created. If one does exist, it will allow it to be updated or cancelled.
*/
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import reduxApi from '../../lib/redux/reduxApi'
import Loading from '../Loading'
// import InterestConfirmationCard from './InterestConfirmationCard'
import RegisterInterestItem from './RegisterInterestItem'
import cuid from 'cuid'
import { InterestStatus } from '../../server/api/interest/interest.constants'

// Helper function to generate a blank interest.
const newInterest = (meid, opid) => {
  return {
    person: meid,
    opportunity: opid,
    status: null,
    dateAdded: Date.now(),
    messages: [],
    termsAccepted: false
  }
}
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
      return null
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
      return null
  }
}

const RegisterInterestSection = ({ meid, opid }) => {
  const interests = useSelector(state => state.interests)
  const dispatch = useDispatch()

  useEffect(() => {
    const getInterests = async () => {
      await dispatch(reduxApi.actions.interests.get({ op: opid, me: meid, cacheBreak: cuid() }))
    }
    getInterests()
  }, [opid, meid])

  // If we haven't finished making the API request to the server yet...
  if (!interests.sync) {
    return (<Loading label='interests' entity={interests} />)
  }

  //  If we have access to the interests section of the Redux store.
  //  Get the interest out of the store, if any.
  let interest = null

  if (interests.sync && interests.data.length > 0) {
    interest = interests.data[0]
  } else { // If not, use a blank interest.
    interest = newInterest(meid, opid)
  }
  // When the button is clicked to advance the interest status, make an appropriate api call.
  const updateInterest = (id, status, message, termsAccepted) => {
    console.log('updateInterest', id, status, message, termsAccepted)
    const putInterest = { }
    if (status && status !== interest.status) {
      // only send if it changes.
      putInterest.status = status
    }

    if (message) {
      putInterest.messages = [{
        body: message,
        author: meid
      }]
      putInterest.termsAccepted = termsAccepted
    }

    if (interest._id) {
      console.log('putInterest', putInterest)
      dispatch(reduxApi.actions.interests.put({ id }, { body: JSON.stringify(putInterest) }))
    } else {
      const postInterest = { ...interest, ...putInterest }
      dispatch(reduxApi.actions.interests.post({}, { body: JSON.stringify(postInterest) }))
    }
  }
  const handleAccept = (message, termsAccepted) => {
    updateInterest(interest._id, getNextStatus(interest.status), message, termsAccepted)
  }
  const handleReject = (message) => {
    const newStatus = getBackStatus(interest.status)
    if (newStatus) {
      updateInterest(interest._id, newStatus, message)
    } else {
      dispatch(reduxApi.actions.interests.delete({ id: interest._id }))
    }
  }
  const handleMessage = (message) => {
    updateInterest(interest._id, interest.status, message, interest.termsAccepted)
  }

  return (
    <>
      <RegisterInterestItem
        interest={interest}
        onAccept={handleAccept}
        onReject={handleReject}
        onMessage={handleMessage}

      />
      {/* removed until InterestConfirmationCard works.
          {(interest.status === InterestStatus.COMMITTED) && (
          <InterestConfirmationCard organizer={interest.opportunity.requestor} />
        )} */}
    </>
  )
}

export default RegisterInterestSection
