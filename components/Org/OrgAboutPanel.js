import Html from '../VTheme/Html'
import { HomeTwoTone, 
  TwitterFilled,
  FacebookFilled,
  MailTwoTone,
  CompassTwoTone,
  PhoneTwoTone } from '@ant-design/icons'

import PropTypes from 'prop-types'
import React from 'react'
import { ContactList, ContactIcon, ActivityContainer } from '../VTheme/VTheme'
import { ProfilePanel } from '../VTheme/Profile'
import { StreetAddressLinkLi } from '../Address/StreetAddress'
import { Divider } from 'antd'
import OrgRole from './OrgRole'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

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
          <li><ContactIcon icon='HomeTwoTone' /><a href={org.website} target='_blank' rel='noopener noreferrer'>{org.website}</a></li>
        )}
        {org.twitter && (
          <li>  <ContactIcon icon='TwitterFilled' /><a href={`http://twitter.com/${org.twitter}`} target='_blank' rel='noopener noreferrer'>{org.twitter}</a></li>
        )}
        {org.facebook && (
          <li><ContactIcon type='FacebookFilled' /><a href={`https://www.facebook.com/${org.facebook}`} target='_blank' rel='noopener noreferrer'>{org.facebook}</a></li>
        )}
        {org.contactEmail && (
          <li><ContactIcon type='MailTwoTone' /><a href={`mailto:${org.contactEmail}`} target='_blank' rel='noopener noreferrer'>{org.contactEmail}</a></li>
        )}
        {org.address && (
          <li><ContactIcon type='CompassTwoTone' /><StreetAddressLinkLi address={org.address} /></li>
        )}
        {org.contactPhoneNumber && (
          <li><ContactIcon type='PhoneTwoTone' /><a tel={org.contactPhoneNumber}>{org.contactPhoneNumber}</a></li>
        )}
      </ContactList>
    </ActivityContainer>
  </ProfilePanel>
)

OrgAboutPanel.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    info: PropTypes.shape({
      about: PropTypes.string
    }),
    role: PropTypes.arrayOf(
      PropTypes.oneOf([OrganisationRole.ADMIN, OrganisationRole.OPPORTUNITY_PROVIDER, OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER, 'other'])
    ).isRequired,
    imgUrl: PropTypes.string,
    website: PropTypes.string,
    contactEmail: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string
  }).isRequired
}

export default OrgAboutPanel
