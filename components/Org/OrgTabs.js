import React from 'react'
import { Tabs } from 'antd'
import MemberSection from '../Member/MemberSection'
import { ProfilePanel } from '../VTheme/Profile'
import { OrgAboutPanel } from './OrgAboutPanel'
import Html from '../VTheme/Html'
import { OrgHistoryPanel } from './OrgHistoryPanel'
import { OrgOffersPanel } from './OrgOffersPanel'
import { orgTab, orgMemberTab, orgInstructionTab, orgOffersTab, orgEditTab, orgHistoryTab } from './OrgTabs.messages'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

const { TabPane } = Tabs

// Warning do not try to group tabs under an isFlag TabPanes must be direct Children of Tabs.
export const OrgTabs = ({
  org,
  onChange,
  canManage,
  tab,
  isAuthenticated
}) => (
  <Tabs
    activeKey={tab} onChange={onChange}
    defaultActiveKey='about'
    type='card' size='large'
    tabBarGutter='5px'
  >
    <TabPane tab={orgTab} key='about'>
      <OrgAboutPanel org={org} />
    </TabPane>
    <TabPane tab={orgOffersTab} key='offers'>
      {/* // TODO: [VP-554] move the OpList for this org from the parent page to a tab  */}
      <OrgOffersPanel organisationId={org._id} />
    </TabPane>
    {org.role.includes(OrganisationRole.OPPORTUNITY_PROVIDER) && (
      <TabPane tab={orgHistoryTab} key='history'>
        <OrgHistoryPanel organisationId={org._id} />
      </TabPane>
    )}
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

  </Tabs>
)

export default OrgTabs
