import React from 'react'
import PropTypes from 'prop-types'
import { TextHeadingSubtitle } from '../VTheme/VTheme'
import OpList from './OpList'

class OpRecommendations extends React.Component {
  render () {
    const { recommendedOps } = this.props
    return (
    <>
      {recommendedOps.basedOnLocation.length !== 0 &&
      <div>
        <TextHeadingSubtitle>Nearby opportunities</TextHeadingSubtitle>
        <OpList ops={recommendedOps.basedOnLocation} />
      </div>}

      {recommendedOps.basedOnSkills.length !== 0 &&
      <div>
        <TextHeadingSubtitle>Based on your skills</TextHeadingSubtitle>
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
