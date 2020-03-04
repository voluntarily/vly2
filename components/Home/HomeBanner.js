import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { PageBanner } from '../../components/VTheme/VTheme'

export const HomeBanner = ({ person, children }) =>
  <PageBanner>
    <h1>
      <FormattedMessage
        id='home.title'
        defaultMessage='Activities'
        description='Title on personal home page'
      />
    </h1>
    {children}
    <FormattedMessage
      defaultMessage='Your current activities, goals and recommendations'
      id='home.subtitle'
    />
  </PageBanner>

HomeBanner.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
}

export default HomeBanner
