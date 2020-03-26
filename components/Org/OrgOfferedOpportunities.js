import PropTypes from 'prop-types'
import { noOpportunitiesFound } from './OrgOfferedOpportunities.messages'
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

  let content = ''

  if (opportunities.length === 0) {
    content = <p>{noOpportunitiesFound}</p>
  } else {
    content = <OpList ops={opportunities} />
  }

  return (
    <section>
      <h2>Offers</h2>
      {content}
    </section>
  )
}

OrgOfferedOpportunities.propTypes = {
  organisationId: PropTypes.string.isRequired
}
