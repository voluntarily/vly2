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
import InterestArchivedTable from './InterestArchivedTable'

export const InterestArchivedSection = ({ opid }) => {
  const interests = useSelector(state => state.interestArchives)
  const dispatch = useDispatch()

  useEffect(() => {
    const getOpInterests = async () => {
      await dispatch(reduxApi.actions.interestArchives.get({ op: opid }))
    }
    getOpInterests()
  }, [opid, dispatch])
  // If we haven't finished making the API request to the server yet...
  if (!interests.sync) {
    return (<Loading label='interestArchives' entity={interests} />)
  }

  const handleAction = async (updatedInterests, action, message) => {
    const putInterest = {
      ...(message && { messages: [{ body: message }] }),
      type: action
    }
    switch (action) {
      case InterestAction.ACCEPT: // Attended
        putInterest.status = InterestStatus.ATTENDED
        break
      case InterestAction.REJECT: // Not Attended
        putInterest.status = InterestStatus.NOTATTENDED
        break
      case InterestAction.MESSAGE:
        break
    }
    await dispatch(reduxApi.actions.interestArchives.put({ id: updatedInterests._id }, { body: JSON.stringify(putInterest) }))
  }

  return (
    <InterestArchivedTable
      interests={interests.data}
      onAction={handleAction}
    />
  )
}
InterestArchivedSection.propTypes = {
  opid: PropTypes.string.isRequired
}

export default InterestArchivedSection
