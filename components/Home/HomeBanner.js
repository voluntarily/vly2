import PropTypes from 'prop-types'
import React from 'react'

import { PageBanner } from '../../components/VTheme/VTheme'

export const HomeBanner = ({ person, children }) =>
  <PageBanner>
    <article>
      <img src={person.imgUrl} />
      <div>
        <h1>{person.name}</h1>
      </div>
    </article>
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
