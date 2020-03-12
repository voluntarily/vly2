import OpList from '../Op/OpList'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReduxLoading from '../Loading'
import { Alert } from 'antd'
import { orgHistoryTitle, orgHistoryNotFound, orgHistoryError } from './OrgHistoryPanel.messages'
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
    if (!loadingState.loading) {
      dispatch(
        reduxApi.actions.archivedOpportunities.get({ q: JSON.stringify({ offerOrg: organisationId }) })
      )
    }
  }, [organisationId])

  let content = ''

  if (loadingState.loading || (!loadingState.sync && !loadingState.error)) {
    content = <ReduxLoading />
  } else if (loadingState.error) {
    content = (
      <Alert
        style={{ margin: '2rem' }}
        message={orgHistoryError}
        type='error'
      />
    )
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
