import PropTypes from 'prop-types'
import React from 'react'

import { PageBanner } from '../../components/VTheme/VTheme'

export const HomeBanner = ({ person, children }) =>
  <PageBanner>
    <img src={person.imgUrl} />
    <h1>{person.name}</h1>
    {children}

  </PageBanner>

HomeBanner.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
}

export default HomeBanner
