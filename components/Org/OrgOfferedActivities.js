import PropTypes from 'prop-types'
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

  return (
    <section>
      <h2>Activities</h2>
      <ActList acts={activities} />
    </section>
  )
}

OrgOfferedActivities.propTypes = {
  organisationId: PropTypes.string.isRequired
}
