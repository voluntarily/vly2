import PropTypes from 'prop-types'
import { OrgOfferedActivities } from './OrgOfferedActivities'
import { OrgOfferedOpportunities } from './OrgOfferedOpportunities'
import { Divider } from 'antd'
import './OrgOffersPanel.less'

export const OrgOffersPanel = ({ organisationId }) => {
  return (
    <section className='orgofferspanel'>
      <OrgOfferedActivities organisationId={organisationId} />
      <Divider />
      <OrgOfferedOpportunities organisationId={organisationId} />
    </section>
  )
}

OrgOffersPanel.propTypes = {
  organisationId: PropTypes.string.isRequired
}
