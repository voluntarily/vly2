import Html from '../VTheme/Html'
import PropTypes from 'prop-types'
import React from 'react'
import { ContactList } from '../VTheme/VTheme'
import { ProfileSection, ProfilePanel } from '../VTheme/Profile'
import { StreetAddressLinkLi } from '../Address/StreetAddress'
import { Icon } from 'antd'

const ContactIcon = ({ type }) =>
  <Icon
    // theme='twoTone'
    twoToneColor='blue'
    type={type}
    style={{ marginRight: '1rem', fontSize: '1.5rem', color: '#6549AA' }}
  />

export const OrgAboutPanel = ({ org, ...props }) => (
  <ProfilePanel>
    <ProfileSection>
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
    </ProfileSection>
    <ProfileSection>
      <Html>
        {(org.info && org.info.about) || ''}
      </Html>

    </ProfileSection>
  </ProfilePanel>
)

OrgAboutPanel.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    info: PropTypes.shape({
      about: PropTypes.string.isRequired
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

export default OrgAboutPanel
