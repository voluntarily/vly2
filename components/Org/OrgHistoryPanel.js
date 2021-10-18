import OpList from '../Op/OpList'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReduxLoading from '../Loading'
import { orgHistoryTitle, orgHistoryNotFound } from './OrgHistoryPanel.messages'
import reduxApi from '../../lib/redux/reduxApi'

export const OrgHistoryPanel = ({ organisationId }) => {
  const archivedOpportunities = useSelector(state => state.archivedOpportunities.data)

  const loadingState = useSelector(state => ({
    sync: state.archivedOpportunities.sync,
    syncing: state.archivedOpportunities.syncing,
    loading: state.archivedOpportunities.loading,
    error: state.archivedOpportunities.error
  }))

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      reduxApi.actions.archivedOpportunities.get({ q: JSON.stringify({ offerOrg: organisationId }) })
    )
  }, [organisationId, dispatch])

  let content = ''

  if (loadingState.loading || (!loadingState.sync && !loadingState.error) || loadingState.error) {
    content = <ReduxLoading entity={loadingState} label='previous opportunities' />
  } else if (archivedOpportunities.length === 0) {
    content = <p>{orgHistoryNotFound}</p>
  } else {
    content = <OpList ops={archivedOpportunities} />
  }

  return (
    <>
      <h2>{orgHistoryTitle}</h2>
      {content}
    </>
  )
}

OrgHistoryPanel.propTypes = {
  organisationId: PropTypes.string.isRequired
}
