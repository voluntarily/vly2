import Html from '../VTheme/Html'
import PropTypes from 'prop-types'
import React from 'react'
import { ContactList, ActivityContainer } from '../VTheme/VTheme'
import { ProfilePanel } from '../VTheme/Profile'
import { StreetAddressLinkLi } from '../Address/StreetAddress'
import { Icon, Divider } from 'antd'
import OrgRole from './OrgRole'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

const ContactIcon = ({ type }) =>
  <Icon
    // theme='twoTone'
    twoToneColor='blue'
    type={type}
    style={{ marginRight: '1rem', fontSize: '1.5rem', color: '#6549AA' }}
  />

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
          <li><ContactIcon type='home' /><a href={org.website} target='_blank' rel='noopener noreferrer'>{org.website}</a></li>
        )}
        {org.twitter && (
          <li>  <ContactIcon type='twitter' /><a href={`http://twitter.com/${org.twitter}`} target='_blank' rel='noopener noreferrer'>{org.twitter}</a></li>
        )}
        {org.facebook && (
          <li><ContactIcon type='facebook' /><a href={`https://www.facebook.com/${org.facebook}`} target='_blank' rel='noopener noreferrer'>{org.facebook}</a></li>
        )}
        {org.contactEmail && (
          <li><ContactIcon type='mail' /><a href={`mailto:${org.contactEmail}`} target='_blank' rel='noopener noreferrer'>{org.contactEmail}</a></li>
        )}
        {org.address && (
          <li><ContactIcon type='compass' /><StreetAddressLinkLi address={org.address} /></li>
        )}
        {org.contactPhoneNumber && (
          <li><ContactIcon type='phone' /><a tel={org.contactPhoneNumber}>{org.contactPhoneNumber}</a></li>
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
