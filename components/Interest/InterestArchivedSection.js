/*
  Smart component. for the given opportunity gets a list of Interests
  and displays them in a table. actions change the state of the interested volunteers
*/
import { useEffect } from 'react'
import InterestArchivedTable from './InterestArchivedTable'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import reduxApi from '../../lib/redux/reduxApi'
import Loading from '../Loading'
import { useSelector, useDispatch } from 'react-redux'
import { InterestStatus, InterestAction } from '../../server/api/interest/interest.constants'

export const InterestArchivedSection = ({ opid }) => {
  const interests = useSelector(state => state.interestsArchived)
  const dispatch = useDispatch()

  useEffect(() => {
    const getOpInterests = async () => {
      await dispatch(reduxApi.actions.interestsArchived.get({ op: opid }))
    }
    getOpInterests()
  }, [opid])
  // If we haven't finished making the API request to the server yet...
  if (!interests.sync) {
    return (<Loading label='interestsArchived' entity={interests} />)
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
    await dispatch(reduxApi.actions.interestsArchived.put({ id: updatedInterests._id }, { body: JSON.stringify(putInterest) }))
  }

  return (
    <section>
      <h2>
        <FormattedMessage
          id='interestArchiveSection.name'
          defaultMessage='Volunteers'
          description='label for interest table on op detail page'
        />
      </h2>
      <InterestArchivedTable
        interests={interests.data}
        onAction={handleAction}
      />
    </section>
  )
}
InterestArchivedSection.propTypes = {
  opid: PropTypes.string.isRequired
}

export default InterestArchivedSection
