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
    // createdAt: Date.now(),
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
    case InterestStatus.INVITED: // op univites
    case InterestStatus.COMMITTED: // vp I can't make it.
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
  //  Get the interest out of the store, if any. filter as there may be others present
  const myinterests = interests.data.filter(interest => interest.person._id === meid)
  const interest = myinterests.length ? myinterests[0] : newInterest(meid, opid)

  // When the button is clicked to advance the interest status, make an appropriate api call.
  const updateInterest = (nextState, message, type) => {
    const status = interest.status
    const newStatus = nextState(status)
    if (!newStatus) { // status is null, we have backed out of existance
      // TODO: how does op learn of the withdrawal?
      return dispatch(reduxApi.actions.interests.delete({ id: interest._id }))
    }

    const putInterest = {
      ...((status !== newStatus) && { status: newStatus }),
      ...(message && { messages: [{ body: message }] }),
      type,
      termsAccepted: true // can't get here without accepting the terms button.
    }

    if (interest._id) {
      return dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(putInterest) }))
    }

    const postInterest = { ...interest, ...putInterest }
    dispatch(reduxApi.actions.interests.post({}, { body: JSON.stringify(postInterest) }))
  }
  const handleAccept = (message) => {
    updateInterest(getNextStatus, message, 'accept')
  }
  const handleReject = (message) => {
    updateInterest(getBackStatus, message, 'reject')
  }
  const handleMessage = (message) => {
    updateInterest(status => status, message, 'message')
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
