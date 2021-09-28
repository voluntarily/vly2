import PropTypes from 'prop-types'
import { OrgOfferedActivities } from './OrgOfferedActivities'
import { OrgOfferedOpportunities } from './OrgOfferedOpportunities'
import { Divider } from 'antd'

export const OrgOffersPanel = ({ organisationId }) => {
  return (
    <section style='margin-bottom: 1rem'>
      <OrgOfferedActivities organisationId={organisationId} />
      <Divider />
      <OrgOfferedOpportunities organisationId={organisationId} />
    </section>
  )
}

OrgOffersPanel.propTypes = {
  organisationId: PropTypes.string.isRequired
}
