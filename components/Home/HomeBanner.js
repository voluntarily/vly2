import PropTypes from 'prop-types'
import React from 'react'

import { PageBanner } from '../../components/VTheme/VTheme'

export const HomeBanner = ({ person, children }) =>
  <PageBanner>
    <img src={person.imgUrl} />
    <div>
      <h1>{person.name}</h1>
      <p>{person.job} {person.placeOfWork} - 32 potatoes earned </p>
    </div>
    {children}

  </PageBanner>

HomeBanner.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    job: PropTypes.string,
    placeOfWork: PropTypes.string,
    imgUrl: PropTypes.string
  }).isRequired
}

export default HomeBanner
