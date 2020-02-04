import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { OpAboutPanel } from './OpAboutPanel'
import OpQuestionPanel from './OpQuestionPanel'
import { OpUpdatePanel } from './OpUpdatePanel'
import { OpManagePanel } from './OpManagePanel'
import VTabs from '../VTheme/VTabs'
const { TabPane } = Tabs

const opAboutTab =
  <FormattedMessage
    id='opTabs.about'
    defaultMessage='About'
    description='Tab label on OpDetailsPage'
  />

const opForumTab =
  <FormattedMessage
    id='opTabs.questions'
    defaultMessage='Questions'
    description='Tab label for Question panel on Opportunity'
  />

const opUpdateTab =
  <FormattedMessage
    id='opTabs.update'
    defaultMessage='Updates'
    description='Tab label for News/Updates panel on Opportunity'
  />

const opManageTab =
  <FormattedMessage
    id='opTabs.manage'
    defaultMessage='Manage'
    description='Tab label for Op Manager panel on Opportunity'
  />

const opEditTab =
  <FormattedMessage
    id='opTabs.edit'
    defaultMessage='Edit'
    description='Tab label for Op Editor panel on Opportunity'
  />

const isNotProd = process.env.NODE_ENV !== 'production'

export const OpTabs = ({ op, onChange, canManage, defaultTab }) => (
  <>
    <VTabs size='large' defaultActiveKey={defaultTab} onChange={onChange}>
      <TabPane tab={opAboutTab} key='about'>
        <OpAboutPanel op={op} />
      </TabPane>

      {isNotProd && (
        <TabPane tab={opForumTab} key='question'>
          <OpQuestionPanel op={op} />
        </TabPane>
      )}
      {isNotProd && (
        <TabPane tab={opUpdateTab} key='news'>
          <OpUpdatePanel op={op} />
        </TabPane>
      )}
      {canManage && (
        <TabPane tab={opManageTab} key='manage'>
          <OpManagePanel op={op} />
        </TabPane>
      )}
      {canManage && (
        <TabPane tab={opEditTab} key='edit' />
      )}
    </VTabs>
  </>
)

OpTabs.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string
  }),
  canManage: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}
export default OpTabs
