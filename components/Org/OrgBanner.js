import PropTypes from 'prop-types'
import React from 'react'
import { ProfileBanner, ProfileBannerImageContainer, ProfileBannerTitle } from '../VTheme/Profile'

const OrgBanner = ({ org, children }) =>
  <ProfileBanner>
    <ProfileBannerImageContainer>
      <img src={org.imgUrl} alt={org.name} />
    </ProfileBannerImageContainer>
    <ProfileBannerTitle>
      <h1>{org.name}</h1>
      <p>{org.description}</p>
      <div>{org.website && <a href='{org.website}'>{org.website}</a>}</div>
      {children}
    </ProfileBannerTitle>
  </ProfileBanner>

OrgBanner.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.arrayOf(
      PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])
    ).isRequired,
    imgUrl: PropTypes.string,
    website: PropTypes.string
  }).isRequired
}

export default OrgBanner
