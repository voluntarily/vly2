import React from 'react'
import PropTypes from 'prop-types'
import OpList from './OpList'
import { FormattedMessage } from 'react-intl'

export const OpRecommendations = ({ type, recommendedOps }) => {
  const locs = recommendedOps.basedOnLocation.filter(op => op.type === type)
  const skills = recommendedOps.basedOnSkills.filter(op => op.type === type)
  return (
    <>
      {locs.length !== 0 &&
        <div>
          <h3>
            <FormattedMessage
              id='OpRecommendations.sectiontitle.basedOnLocation'
              defaultMessage='Based on your locations'
            />
          </h3>
          <OpList ops={locs} />
        </div>}

      {skills.length !== 0 &&
        <div>
          <h3>
            <FormattedMessage
              id='OpRecommendations.sectiontitle.basedOnSkills'
              defaultMessage='Based on your skills and interests'
            />
          </h3>
          <OpList ops={skills} />
        </div>}
    </>)
}

OpRecommendations.propTypes = {
  recommendedOps: PropTypes.shape({
    basedOnLocation: PropTypes.array,
    basedOnSkills: PropTypes.array
  }).isRequired
}

export default OpRecommendations
