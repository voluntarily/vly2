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

const orgEditTab =
  <FormattedMessage
    id='orgTabs.edit'
    defaultMessage='Edit'
    description='Tab label for org Editor panel on organisation page'
  />

// Warning do not try to group tabs under an isFlag TabPanes must be direct Children of Tabs.
export const OrgTabs = ({ org, onChange, canManage, defaultTab, isAuthenticated }) => (
  <VTabs defaultActiveKey={defaultTab} onChange={onChange}>
    <TabPane tab={orgTab} key='about'>
      <OrgAboutPanel org={org} />
    </TabPane>
    <TabPane tab={orgOffersTab} key='offers'>
      {/* // TODO: [VP-554] move the OpList for this org from the parent page to a tab  */}
    </TabPane>
    {isAuthenticated && (
      <TabPane tab={orgInstructionTab} key='instructions'>
        <ProfilePanel>
          <Html>
            {(org.info && org.info.instructions) || ''}
          </Html>
        </ProfilePanel>
      </TabPane>)}
    {isAuthenticated && (
      <TabPane tab={orgMemberTab} key='members'>
        <MemberSection org={org} />
      </TabPane>)}

    {canManage && (
      <TabPane tab={orgEditTab} key='edit' />
    )}

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
    domainName: PropTypes.string,
    twitter: PropTypes.string
  }).isRequired
}

export default OrgTabs
