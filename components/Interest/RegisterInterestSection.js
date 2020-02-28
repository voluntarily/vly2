/*
  Smart component. For the given op id and person id, it displays that person's interest in that op.
  If no interest exists, it will allow one to be created. If one does exist, it will allow it to be updated or cancelled.
*/
import { message } from 'antd'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import reduxApi from '../../lib/redux/reduxApi'
import Loading from '../Loading'
// import InterestConfirmationCard from './InterestConfirmationCard'
import RegisterInterestItem from './RegisterInterestItem'
import cuid from 'cuid'
import { InterestStatus } from '../../server/api/interest/interest.constants'

// Helper function to generate a blank interest.
function getNewInterest (meid, opid) {
  return {
    person: meid,
    opportunity: opid,
    status: null,
    dateAdded: Date.now()
  }
}
// Returns the next status, given the current status
function getNextStatus (interest) {
  switch (interest.status) {
    case null:
      return InterestStatus.INTERESTED

    case InterestStatus.INVITED:
      return InterestStatus.COMMITTED
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

  // When the button is clicked to advance the interest status, make an appropriate api call.
  const handleChangeStatus = async (interest) => {
    interest.status = getNextStatus(interest)

    if (interest._id) {
      await dispatch(reduxApi.actions.interests.put({ id: interest._id }, { body: JSON.stringify(interest) }))
      message.success('Interest updated')
    } else {
      await dispatch(reduxApi.actions.interests.post({}, { body: JSON.stringify(interest) }))
      message.success('Interest added')
    }
  }

  // When the button is clicked to withdraw interest, make an appropriate api call.
  const handleWithdraw = async (interest) => {
    await dispatch(reduxApi.actions.interests.delete({ id: interest._id }))
    message.success('Interest withdrawn')
  }
  // If we haven't finished making the API request to the server yet...
  if (!interests.sync) {
    return (<Loading label='interests' entity={interests} />)
  }

  // Render the component depending on whether we've completed the initial api call, and what information is contained in the store.

  //  If we have access to the interests section of the Redux store.
  //  Get the interest out of the store, if any.
  let interest = null

  if (interests.sync && interests.data.length > 0) {
    interest = interests.data[0]
  } else { // If not, use a blank interest.
    interest = getNewInterest(meid, opid)
  }

  return (
    <section>
      <RegisterInterestItem
        interest={interest}
        onChangeStatus={handleChangeStatus}
        onWithdraw={handleWithdraw}
      />
      {/* removed until InterestConfirmationCard works.
          {(interest.status === InterestStatus.COMMITTED) && (
          <InterestConfirmationCard organizer={interest.opportunity.requestor} />
        )} */}
    </section>
  )
}

export default RegisterInterestSection
