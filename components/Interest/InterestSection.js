/*
  Smart component. for the given opportunity gets a list of Interests
  and displays them in a table. actions change the state of the interested volunteers
*/
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import reduxApi from '../../lib/redux/reduxApi'
import { InterestAction, InterestStatus } from '../../server/api/interest/interest.constants'
import Loading from '../Loading'
import InterestTable from './InterestTable'

export const InterestSection = ({ opid }) => {
  const interests = useSelector(state => state.interests)
  const dispatch = useDispatch()

  useEffect(() => {
    const getOpInterests = async () => {
      await dispatch(reduxApi.actions.interests.get({ op: opid }))
    }
    getOpInterests()
  }, [opid, dispatch])
  // If we haven't finished making the API request to the server yet...
  if (!interests.sync) {
    return (<Loading label='interests' entity={interests} />)
  }

  const handleAction = async (updatedInterests, action, message) => {
    const putInterest = {
      ...(message && { messages: [{ body: message }] }),
      type: action
    }
    switch (action) {
      case InterestAction.ACCEPT:
        putInterest.status = InterestStatus.INVITED
        break
      case InterestAction.REJECT:
        putInterest.status = InterestStatus.DECLINED
        break
      case InterestAction.WITHDRAW:
        putInterest.type = InterestAction.REJECT
        putInterest.status = InterestStatus.INTERESTED
        break
      case InterestAction.MESSAGE:
        break
    }
    // if (Array.isArray(updatedInterests)) {
    //   updatedInterests.forEach(async interest => {
    //     await dispatch(reduxApi.actions.interests.put({ id: updatedInterests._id }, { body: JSON.stringify(putInterest) }))
    //     /* BUG: the problem here is that we issue a sequence of dispatch calls in a loop
    //       the second put does not run because the first has set the data into the loading state.
    //       by the time the data has returned we have finished.
    //       so only one item in the list gets updated.
    //       */
    //   })
    // } else {
    await dispatch(reduxApi.actions.interests.put({ id: updatedInterests._id }, { body: JSON.stringify(putInterest) }))
    // }
  }

  return (
    <InterestTable
      interests={interests.data}
      onAction={handleAction}
    />
  )
}
InterestSection.propTypes = {
  opid: PropTypes.string.isRequired
}
export default InterestSection
