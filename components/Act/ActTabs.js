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
// const opForumTab =
//   <FormattedMessage
//     id='actTabs.questions'
//     defaultMessage='Questions'
//     description='Tab label for Question panel on Opportunity'
//   />

// const opUpdateTab =
//   <FormattedMessage
//     id='actTabs.update'
//     defaultMessage='Updates'
//     description='Tab label for News/Updates panel on Opportunity'
//   />

// const actReportsTab =
//   <FormattedMessage
//     id='actTabs.reports'
//     defaultMessage='Reports'
//     description='Tab label for Activity Reports panel'
//   />

const actEditTab =
  <FormattedMessage
    id='actTabs.edit'
    defaultMessage='Edit'
    description='Tab label for Act Editor panel on Opportunity'
  />

// const isNotProd = process.env.NODE_ENV !== 'production'

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
      {bp &&
        <TabPane tab={actOffersTab} key='offer'>
          <ActOpsPanel act={act} type={OFFER} />
        </TabPane>}
      {vp &&
        <TabPane tab={actRequestsTab} key='ask'>
          <ActOpsPanel act={act} type={ASK} />
        </TabPane>}
      {act.resources &&
        <TabPane tab={actResourcesTab} key='resources'>
          <ActResourcesPanel act={act} />
        </TabPane>}

      {/*
    {isNotProd && (
      <TabPane tab={opForumTab} key='question'>
        <OpQuestionPanel act={act} />
      </TabPane>
    )}
    {isNotProd && (
      <TabPane tab={opUpdateTab} key='news'>
        <OpUpdatePanel albumId={act._id} author={author} />
      </TabPane>
    )} */}
      {/* {canManage && (
      <TabPane tab={actReportsTab} key='reports'>
        <ActReportsPanel act={act} />
      </TabPane>
    )} */}
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
