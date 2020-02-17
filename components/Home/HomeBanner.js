import PropTypes from 'prop-types'
import React from 'react'
import { ProfileBanner, ProfileBannerTitle } from '../VTheme/Profile'

const HomeBanner = ({ person, children }) =>
  <ProfileBanner>
    <img src={person.imgUrl} alt={person.name} />
    <ProfileBannerTitle>
      <h1>{person.name}</h1>
      {/* {org.website && <a href='{org.website}'>{org.website}</a>} */}
      {children}
    </ProfileBannerTitle>
  </ProfileBanner>

HomeBanner.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
}

export default HomeBanner
