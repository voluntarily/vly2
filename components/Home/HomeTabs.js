import { Icon, Tabs } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import MemberSection from '../Member/MemberSection'
import { ProfilePanel } from '../VTheme/Profile'
import { personAboutPanel } from './personAboutPanel'
import Html from '../VTheme/Html'
import VTabs from '../VTheme/VTabs'
const { TabPane } = Tabs

const homeActiveTab = (
  <span>
    <Icon type='inbox' />
    <FormattedMessage
      id='home.tab.active'
      defaultMessage='Active'
      description='show opportunities list on volunteer home page'
    />
  </span>
)
const homeHistoryTab = (
  <span>
    <Icon type='history' />
    <FormattedMessage
      id='home.tab.history'
      defaultMessage='History'
      description='show volunteering history on volunteer home page'
    />
  </span>
)
const homeProfileTab = (
  <span>
    <Icon type='setting' />
    <FormattedMessage
      id='home.tab.profile'
      defaultMessage='Profile'
      description='show profile on volunteer home page'
    />
  </span>
)
const homeDiscoverTab = (
  <span>
    <Icon type='file-search' />
    <FormattedMessage
      id='home.tab.discover'
      defaultMessage='Discover'
      description='tab to find new ops and recommendations'
    />
  </span>
)

export const HomeTabs = ({ person, onChange }) => (
  <VTabs defaultActiveKey='1' onChange={onChange}>
    <TabPane tab={homeActiveTab} key='active'>
      <HomeActivePanel person={person} />
    </TabPane>
    <TabPane tab={homeDiscoverTab} key='discover'>
      <HomeDiscoverPanel person={person} />
    </TabPane>
    <TabPane tab={homeHistoryTab} key='history'>
      <HomeHistoryPanel />
    </TabPane>
    <TabPane tab={homeProfileTab} key='profile' />
      <HomeProfilePanel />
    </TabPane>
  </VTabs>
)

HomeTabs.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    info: PropTypes.shape({
      about: PropTypes.string,
      followers: PropTypes.string,
      joiners: PropTypes.string,
      members: PropTypes.string,
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

export default HomeTabs
