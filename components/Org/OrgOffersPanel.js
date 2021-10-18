import { OrgOfferedActivities } from './OrgOfferedActivities'
import { OrgOfferedOpportunities } from './OrgOfferedOpportunities'
import { Divider } from 'antd'

export const OrgOffersPanel = ({ organisationId }) => {
  return (
    <section style={{ marginBottom: '1rem' }}>
      <OrgOfferedActivities organisationId={organisationId} />
      <Divider />
      <OrgOfferedOpportunities organisationId={organisationId} />
    </section>
  )
}
