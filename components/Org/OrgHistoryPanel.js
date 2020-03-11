import OpList from '../Op/OpList'
import PropTypes from 'prop-types'
import React from 'react'
import ReduxLoading from '../Loading'
import { Alert } from 'antd'

export const OrgHistoryPanel = ({ archivedOpportunities, error, isLoading }) => {
  let content = ''

  if (isLoading) {
    content = <ReduxLoading />
  } else if (error) {
    content = (
      <Alert
        style={{ margin: '2rem' }}
        message='Something went wrong'
        type='error'
      />
    )
  } else if (archivedOpportunities.length === 0) {
    content = <p>This organisation does not have any archived opportunities.</p>
  } else {
    content = <OpList ops={archivedOpportunities} />
  }

  return (
    <>
      <h2>Previous opportunities</h2>
      {content}
    </>
  )
}

OrgHistoryPanel.propTypes = {
  archivedOpportunities: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object
}
