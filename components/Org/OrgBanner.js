import PropTypes from 'prop-types'
import React from 'react'
import { VBanner, VBannerImg, ProfileBannerTitle } from '../VTheme/Profile'
import TagDisplay from '../Tags/TagDisplay'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

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
    role: PropTypes.arrayOf(
      PropTypes.oneOf([OrganisationRole.ADMIN, OrganisationRole.OPPORTUNITY_PROVIDER, OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER, 'other'])
    ).isRequired,
    imgUrl: PropTypes.string,
    website: PropTypes.string
  }).isRequired
}

export default OrgBanner
