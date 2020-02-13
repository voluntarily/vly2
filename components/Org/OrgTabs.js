import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import MemberSection from '../Member/MemberSection'
import { ProfilePanel } from '../VTheme/Profile'
import { OrgAboutPanel } from './OrgAboutPanel'
import Html from '../VTheme/Html'
import VTabs from '../VTheme/VTabs'
const { TabPane } = Tabs

const orgTab =
  <FormattedMessage
    id='orgTabs.about'
    defaultMessage='About'
    description='Tab label on OrgDetailsPage'
  />

const orgMemberTab =
  <FormattedMessage
    id='orgMembers'
    defaultMessage='Members'
    description='show opportunities list on volunteer home page'
  />

const orgInstructionTab =
  <FormattedMessage
    id='orgInstructions'
    defaultMessage='Getting Started'
    description='show opportunities list on volunteer home page'
  />

const orgOffersTab =
  <FormattedMessage
    id='orgOffers'
    defaultMessage='Offers'
    description='show opportunities list on volunteer home page'
  />

// const orgSettingsTab =
//   <FormattedMessage
//     id='orgSettings'
//     defaultMessage='Settings'
//     description='show opportunities list on volunteer home page'
//   />

export const OrgTabs = ({ org, onChange }) => (
  <VTabs defaultActiveKey='1' onChange={onChange}>
    <TabPane tab={orgTab} key='1'>
      <OrgAboutPanel org={org} />
    </TabPane>
    {/* <TabPane tab={orgResourcesTab} key='2' /> */}
    {/* // TODO: [VP-554] move the OpList for this org from the parent page to a tab  */}
    <TabPane tab={orgInstructionTab} key='3'>
      <ProfilePanel>
        <Html>
          {(org.info && org.info.instructions) || ''}
        </Html>
      </ProfilePanel>
    </TabPane>
    <TabPane tab={orgMemberTab} key='4'>
      <MemberSection org={org} />
    </TabPane>
    <TabPane tab={orgOffersTab} key='5' />
    {/* <TabPane tab={orgSettingsTab} key='6' /> */}
  </VTabs>
)

OrgTabs.propTypes = {
  org: PropTypes.shape({
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

export default OrgTabs
