import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ActAboutPanel } from './ActAboutPanel'
import { ActOpsPanel } from './ActOpsPanel'
import { ActResourcesPanel } from './ActResourcesPanel'
import { Role } from '../../server/services/authorize/role.js'
import VTabs from '../VTheme/VTabs'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { OpTypeCount } from '../Op/OpType'
const { ASK, OFFER } = OpportunityType

const { TabPane } = Tabs

const actAboutTab =
  <FormattedMessage
    id='actTabs.about'
    defaultMessage='About'
    description='Tab label on ActTabs'
  />

const actResourcesTab =
  <FormattedMessage
    id='actTabs.resources'
    defaultMessage='Resources'
    description='Tab label on ActTabs'
  />

const actEditTab =
  <FormattedMessage
    id='actTabs.edit'
    defaultMessage='Edit'
    description='Tab label for Act Editor panel on Opportunity'
  />

export const ActTabs = ({ act, me, onChange, canManage, canEdit, defaultTab }) => {
  const actRequestsTab = <OpTypeCount counts={act.opCounts} type={ASK} />
  const actOffersTab = <OpTypeCount counts={act.opCounts} type={OFFER} />
  const vp = me.role.includes(Role.VOLUNTEER)
  const bp = me.role.includes(Role.BASIC)
  return (
    <VTabs size='large' defaultActiveKey={defaultTab} onChange={onChange}>
      {act.description &&
        <TabPane tab={actAboutTab} key='about'>
          <ActAboutPanel act={act} />
        </TabPane>}
      {vp &&
        <TabPane tab={actRequestsTab} key='ask'>
          <ActOpsPanel act={act} type={ASK} />
        </TabPane>}
      {bp &&
        <TabPane tab={actOffersTab} key='offer'>
          <ActOpsPanel act={act} type={OFFER} />
        </TabPane>}
      <TabPane tab={actResourcesTab} key='resources'>
        <ActResourcesPanel act={act} />
      </TabPane>
      {canEdit && (
        <TabPane tab={actEditTab} key='edit' />
      )}
    </VTabs>
  )
}

ActTabs.propTypes = {
  act: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    _id: PropTypes.string
  }),
  canManage: PropTypes.bool,
  canEdit: PropTypes.bool,
  onChange: PropTypes.func
}
export default ActTabs
