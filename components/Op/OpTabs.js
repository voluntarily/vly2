import React from 'react'
import { Tabs } from 'antd'
import { FormattedMessage } from 'react-intl'
import { OpAboutPanel } from './OpAboutPanel'
import { OpQuestionPanel } from './OpQuestionPanel'
// import OpUpdatePanel from './OpUpdatePanel'
import { OpManagePanel } from './OpManagePanel'
import OpChatPanel from './OpChatPanel'
import { useSelector } from 'react-redux'

const { TabPane } = Tabs

const opAboutTab =
  <FormattedMessage
    id='opTabs.about'
    defaultMessage='About'
    description='Tab label on OpDetailsPage'
  />
const opChatTab =
  <FormattedMessage
    id='opTabs.chat'
    defaultMessage='Messages'
    description='Tab label on OpDetailsPage'
  />

const opForumTab =
  <FormattedMessage
    id='opTabs.questions'
    defaultMessage='Questions'
    description='Tab label for Question panel on Opportunity'
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

export const OpTabs = ({
  op,
  onChange,
  canManage,
  canEdit,
  tab
}) => {
  const interest = useSelector(state => state.interests.data[0])
  return (
    <Tabs
      activeKey={tab} onChange={onChange}
      defaultActiveKey='about'
      type='card' size='large'
      tabBarGutter='5px'
    >
      <TabPane tab={opAboutTab} key='about'>
        <OpAboutPanel op={op} />
      </TabPane>
      {!canManage && !(interest === undefined) &&
        <TabPane tab={opChatTab} key='chat'>
          <OpChatPanel op={op} />
        </TabPane>}
      {isNotProd && (
        <TabPane tab={opForumTab} key='question'>
          <OpQuestionPanel op={op} />
        </TabPane>
      )}

      {canManage && (
        <TabPane tab={opManageTab} key='manage'>
          <OpManagePanel op={op} />
        </TabPane>
      )}
      {canEdit && (
        <TabPane tab={opEditTab} key='edit' />
      )}
    </Tabs>
  )
}

export default OpTabs
