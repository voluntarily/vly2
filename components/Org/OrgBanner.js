import PropTypes from 'prop-types'
import React from 'react'
import { VBanner, VBannerImg, ProfileBannerTitle } from '../VTheme/Profile'
import TagDisplay from '../Tags/TagDisplay'

const OrgBanner = ({ org, children }) =>
  <VBanner>
    <VBannerImg src={org.imgUrl} alt={org.name} />
    <ProfileBannerTitle>
      <h1>{org.name}</h1>
      <div>{org.website && <a href='{org.website}'>{org.website}</a>}</div>
      <div>For: <TagDisplay tags={org.groups} /></div>
      {children}
    </ProfileBannerTitle>
  </VBanner>

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
