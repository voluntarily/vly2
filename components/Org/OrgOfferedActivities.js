import PropTypes from 'prop-types'
import { noActivitiesFound } from './OrgOfferedActivities.messages'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import reduxApi from '../../lib/redux/reduxApi'
import ActList from '../Act/ActList'

export const OrgOfferedActivities = ({ organisationId }) => {
  const activities = useSelector(state => state.activities.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(reduxApi.actions.activities.get({ q: JSON.stringify({ offerOrg: organisationId }) }))
  }, [organisationId])

  let content = ''

  if (activities.length === 0) {
    content = <p>{noActivitiesFound}</p>
  } else {
    content = <ActList acts={activities} />
  }

  return (
    <section>
      <h2>Activities</h2>
      {content}
    </section>
  )
}

OrgOfferedActivities.propTypes = {
  organisationId: PropTypes.string.isRequired
}
