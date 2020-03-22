import React from 'react'
import PropTypes from 'prop-types'
import OpList from './OpList'

import { ProfileSectionTitle } from '../VTheme/Profile'
import { Divider } from 'antd'

class OpRecommendations extends React.Component {
  render () {
    const { recommendedOps } = this.props
    return (
      <>
        {recommendedOps.basedOnLocation.length !== 0 &&
          <div>
            <Divider />
            <ProfileSectionTitle>
              Nearby opportunities
            </ProfileSectionTitle>
            <OpList ops={recommendedOps.basedOnLocation} />
          </div>}

        {recommendedOps.basedOnSkills.length !== 0 &&
          <div>
            <Divider />
            <ProfileSectionTitle>
              Based on your skills
            </ProfileSectionTitle>
            <OpList ops={recommendedOps.basedOnSkills} />
          </div>}
      </>)
  }
}

OpRecommendations.propTypes = {
  recommendedOps: PropTypes.shape({
    basedOnLocation: PropTypes.array,
    basedOnSkills: PropTypes.array
  }).isRequired
}

export default OpRecommendations
