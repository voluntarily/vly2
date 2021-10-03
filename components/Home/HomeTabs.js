import React from 'react'
import { Tabs } from 'antd'
import { InboxOutlined, HistoryOutlined, SettingOutlined, FileSearchOutlined } from '@ant-design/icons'
import { FormattedMessage } from 'react-intl'
import { ProfilePanel } from '../VTheme/Profile'
import PersonalGoalSection from '../Goal/PersonalGoalSection'
import ActiveOpsSection from '../Op/ActiveOpsSection'
import InterestedOpsSection from '../Op/InterestedOpsSection'
import ArchivedOpsSection from '../Op/ArchivedOpsSection'
import ArchivedInterestedOpsSection from '../Op/ArchivedInterestedOpsSection'
import RecommendedOpsSection from '../Op/RecommendedOpsSection'
import EditablePersonPanel from '../../components/Person/EditablePersonPanel'

const { TabPane } = Tabs

const homeActiveTab = (
  <>
    <InboxOutlined />
    <FormattedMessage
      id='home.tab.active'
      defaultMessage='Upcoming'
      description='show opportunities list on volunteer home page'
    />
  </>
)
const homeHistoryTab = (
  <>
    <HistoryOutlined />
    <FormattedMessage
      id='home.tab.history'
      defaultMessage='History'
      description='show volunteering history on volunteer home page'
    />
  </>
)
const homeProfileTab = (
  <>
    <SettingOutlined />
    <FormattedMessage
      id='home.tab.profile'
      defaultMessage='Profile'
      description='show profile on volunteer home page'
    />
  </>
)
const homeDiscoverTab = (
  <>
    <FileSearchOutlined />
    <FormattedMessage
      id='home.tab.discover'
      defaultMessage='Discover'
      description='tab to find new ops and recommendations'
    />
  </>
)

export const HomeTabs = ({ person, onChange, tab }) =>
  <Tabs
    activeKey={tab} onChange={onChange}
    type='card' size='large'
    tabBarGutter='5px'
  >
    <TabPane tab={homeDiscoverTab} key='discover' style={{ overflow: 'visible' }}>
      <ProfilePanel>
        <PersonalGoalSection />
        <RecommendedOpsSection />
      </ProfilePanel>
    </TabPane>
    <TabPane tab={homeActiveTab} key='active' style={{ overflow: 'visible' }}>
      <ProfilePanel>

        <ActiveOpsSection />
        <InterestedOpsSection />
      </ProfilePanel>
    </TabPane>

    <TabPane tab={homeHistoryTab} key='history'>
      <ProfilePanel>
        <ArchivedOpsSection />
        <ArchivedInterestedOpsSection />
      </ProfilePanel>
    </TabPane>
    <TabPane tab={homeProfileTab} key='profile'>
      <ProfilePanel>
        <EditablePersonPanel person={person} />
      </ProfilePanel>
    </TabPane>
  </Tabs>

export default HomeTabs
