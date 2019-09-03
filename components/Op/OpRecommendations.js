import React from 'react'
import PropTypes from 'prop-types'
import { H5 } from '../VTheme/VTheme'
import OpList from './OpList'

class OpRecommendations extends React.Component {
  render () {
    const { recommendedOps } = this.props
    return (
    <>
      {recommendedOps.basedOnLocation.length !== 0 &&
      <div>
        <H5>Nearby opportunities</H5>
        <OpList ops={recommendedOps.basedOnLocation} />
      </div>}

      {recommendedOps.basedOnSkills.length !== 0 &&
      <div>
        <H5>Based on your skills</H5>
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
