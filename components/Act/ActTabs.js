import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ActAboutPanel } from './ActAboutPanel'
import { ActOpsPanel } from './ActOpsPanel'
import { ActResourcesPanel } from './ActResourcesPanel'
// import { ActReportsPanel } from './ActReportsPanel'
import VTabs from '../VTheme/VTabs'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

const { TabPane } = Tabs

const actAboutTab =
  <FormattedMessage
    id='actTabs.about'
    defaultMessage='About'
    description='Tab label on ActTabs'
  />

// const actRequestsTab =
//   <FormattedMessage
//     id='actTabs.asks'
//     defaultMessage='Asks'
//     description='Tab label on ActTabs'
//   />

const actApplyTab =
  <FormattedMessage
    id='actTabs.offers'
    defaultMessage='Apply'
    description='Tab label on ActTabs'
  />

const actDocumentsTab =
  <FormattedMessage
    id='actTabs.documents'
    defaultMessage='Additional Documents'
    description='Tab label on ActTabs'
  />

const actLearningTab =
  <FormattedMessage
    id='actTabs.learning'
    defaultMessage='Learning Resources'
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

export const ActTabs = ({ act, onChange, canManage, canEdit, defaultTab }) => (
  <VTabs size='large' defaultActiveKey={defaultTab} onChange={onChange}>
    <TabPane tab={actAboutTab} key='about'>
      <ActAboutPanel act={act} />
    </TabPane>
    {/* <TabPane tab={actRequestsTab} key='ask'>
      <ActOpsPanel act={act} type={ASK} />
    </TabPane> */}
    <TabPane tab={actApplyTab} key='positions'>
      <ActOpsPanel act={act} type={ASK} />
    </TabPane>
    <TabPane tab={actDocumentsTab} key='documents'>
      <ActResourcesPanel act={act} />
    </TabPane>
    <TabPane tab={actLearningTab} key='learning'>
      <ActResourcesPanel act={act} />
    </TabPane>

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
