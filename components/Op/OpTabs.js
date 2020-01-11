import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { OpAboutPanel } from './OpAboutPanel'
import { OpQuestionPanel } from './OpQuestionPanel'
import { OpUpdatePanel } from './OpUpdatePanel'
import { OpManagePanel } from './OpManagePanel'
const shadowStyle = { overflow: 'visible', textAlign: 'center' }
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

const opNewsTab =
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

export const OpTabs = ({ op, onChange, canManage }) => (
  <>
    <Tabs style={shadowStyle} defaultActiveKey='1' onChange={onChange}>
      <TabPane tab={opAboutTab} key='1'>
        <OpAboutPanel op={op} />
      </TabPane>

      {isNotProd && (
        <TabPane tab={opForumTab} key='2'>
          <OpQuestionPanel op={op} />
        </TabPane>
      )}
      {isNotProd && (
        <TabPane tab={opNewsTab} key='3'>
          <OpUpdatePanel op={op} />
        </TabPane>
      )}
      {canManage && (
        <TabPane tab={opManageTab} key='4'>
          <OpManagePanel op={op} />
        </TabPane>
      )}
      {canManage && (
        <TabPane tab={opEditTab} key='5' />
      )}
    </Tabs>
  </>
)

OpTabs.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    info: PropTypes.shape({
      about: PropTypes.string,
      followers: PropTypes.string,
      joiners: PropTypes.string,
      forum: PropTypes.string,
      outsiders: PropTypes.string
    }),
    category: PropTypes.arrayOf(
      PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])
    ).isRequired,
    imgUrl: PropTypes.string,
    website: PropTypes.string,
    contactEmail: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string
  }).isRequired
}

export default OpTabs
