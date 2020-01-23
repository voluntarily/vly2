import PropTypes from 'prop-types'
import React from 'react'
import { ProfileBanner, ProfileBannerTitle } from '../VTheme/Profile'
import OrgCategory from './OrgCategory'

const OrgBanner = ({ org, children }) =>
  <ProfileBanner>
    <img src={org.imgUrl} alt={org.name} />
    <ProfileBannerTitle>
      <h1><OrgCategory orgCategory={org.category} />{org.name}</h1>
      {/* {org.website && <a href='{org.website}'>{org.website}</a>} */}
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
