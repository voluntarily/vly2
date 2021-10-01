import Html from '../VTheme/Html'
import {
  HomeOutlined,
  TwitterOutlined,
  FacebookFilled,
  MailOutlined,
  CompassOutlined,
  PhoneOutlined
} from '@ant-design/icons'

import React from 'react'
import { ContactList, ActivityContainer } from '../VTheme/VTheme'
import { ProfilePanel } from '../VTheme/Profile'
import { StreetAddressLinkLi } from '../Address/StreetAddress'
import { Divider } from 'antd'
import OrgRole from './OrgRole'

export const OrgAboutPanel = ({ org }) => (
  <ProfilePanel>

    <ActivityContainer>

      <h2>About</h2>
      <div>
        <Html>
          {(org.info && org.info.about) || ''}
        </Html>
        <OrgRole orgRole={org.role} />
      </div>

    </ActivityContainer>

    <Divider />
    <ActivityContainer>
      <h2>Contact</h2>
      <ContactList>
        {org.website && (
          <li><HomeOutlined /> <a href={org.website} target='_blank' rel='noopener noreferrer'>{org.website}</a></li>
        )}
        {org.twitter && (
          <li><TwitterOutlined /> <a href={`http://twitter.com/${org.twitter}`} target='_blank' rel='noopener noreferrer'>{org.twitter}</a></li>
        )}
        {org.facebook && (
          <li><FacebookFilled /> <a href={`https://www.facebook.com/${org.facebook}`} target='_blank' rel='noopener noreferrer'>{org.facebook}</a></li>
        )}
        {org.contactEmail && (
          <li><MailOutlined /> <a href={`mailto:${org.contactEmail}`} target='_blank' rel='noopener noreferrer'>{org.contactEmail}</a></li>
        )}
        {org.address && (
          <li><CompassOutlined /> <StreetAddressLinkLi address={org.address} /></li>
        )}
        {org.contactPhoneNumber && (
          <li><PhoneOutlined /> <a tel={org.contactPhoneNumber}>{org.contactPhoneNumber}</a></li>
        )}
      </ContactList>
    </ActivityContainer>
  </ProfilePanel>
)

export default OrgAboutPanel
