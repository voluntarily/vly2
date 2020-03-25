import OpList from '../Op/OpList'
import React from 'react'
import { useSelector } from 'react-redux'
import ReduxLoading from '../Loading'
import { FormattedMessage } from 'react-intl'

const actRequestsNotFound = (
  <FormattedMessage
    id='actTabs.requests.notfound'
    defaultMessage='This activity does not have any opportunities.'
    description='Message to display when an activity does not have any archived opportunities'
  />
)

export const ActOpsPanel = ({ actId, type }) => {
  const opportunities = useSelector(state => state.opportunities.data)

  const loadingState = useSelector(state => ({
    sync: state.opportunities.sync,
    syncing: state.opportunities.syncing,
    loading: state.opportunities.loading,
    error: state.opportunities.error
  }))

  if (loadingState.loading || (!loadingState.sync && !loadingState.error) || loadingState.error) {
    return <ReduxLoading entity={loadingState} label='opportunities' />
  }

  if (opportunities.length === 0) {
    return <p>{actRequestsNotFound}</p>
  }

  return <OpList ops={opportunities.filter(op => op.type === type)} />
}
