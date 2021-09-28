import Html from '../VTheme/Html'
import {
  HomeTwoTone,
  TwitterFilled,
  FacebookFilled,
  MailTwoTone,
  CompassTwoTone,
  PhoneTwoTone
} from '@ant-design/icons'

import React from 'react'
import { ContactList, ActivityContainer } from '../VTheme/VTheme'
import { ProfilePanel } from '../VTheme/Profile'
import { StreetAddressLinkLi } from '../Address/StreetAddress'
import { Divider } from 'antd'
import OrgRole from './OrgRole'
// import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

export const OrgAboutPanel = ({ org, ...props }) => (
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
          <li><HomeTwoTone /> <a href={org.website} target='_blank' rel='noopener noreferrer'>{org.website}</a></li>
        )}
        {org.twitter && (
          <li>  <TwitterFilled /> <a href={`http://twitter.com/${org.twitter}`} target='_blank' rel='noopener noreferrer'>{org.twitter}</a></li>
        )}
        {org.facebook && (
          <li><FacebookFilled /> <a href={`https://www.facebook.com/${org.facebook}`} target='_blank' rel='noopener noreferrer'>{org.facebook}</a></li>
        )}
        {org.contactEmail && (
          <li><MailTwoTone /> <a href={`mailto:${org.contactEmail}`} target='_blank' rel='noopener noreferrer'>{org.contactEmail}</a></li>
        )}
        {org.address && (
          <li><CompassTwoTone /> <StreetAddressLinkLi address={org.address} /></li>
        )}
        {org.contactPhoneNumber && (
          <li><PhoneTwoTone /> <a tel={org.contactPhoneNumber}>{org.contactPhoneNumber}</a></li>
        )}
      </ContactList>
    </ActivityContainer>
  </ProfilePanel>
)

export default OrgAboutPanel
