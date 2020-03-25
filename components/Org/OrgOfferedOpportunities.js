import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import reduxApi from '../../lib/redux/reduxApi'
import OpList from '../Op/OpList'

export const OrgOfferedOpportunities = ({ organisationId }) => {
  const opportunities = useSelector(state => state.opportunities.data)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(reduxApi.actions.opportunities.get({ q: JSON.stringify({ offerOrg: organisationId }) }))
  }, [organisationId])

  return (
    <section>
      <h2>Offers</h2>
      <OpList ops={opportunities} />
    </section>
  )
}

OrgOfferedOpportunities.propTypes = {
  organisationId: PropTypes.string.isRequired
}
