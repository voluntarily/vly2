/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import ActCard from './ActCard'
import { FormattedMessage } from 'react-intl'
import { ActivityGrid } from '../VTheme/VTheme'

const ActList = ({ acts, ...props }) => (
  <ActivityGrid>
    {acts ? (
      acts.map((act, index) => <ActCard act={act} key={index} />)
    ) : (
      <FormattedMessage
        id='act.list.empty'
        defaultMessage='No matching activities'
        description='no activities message in ActList'
      />
    )}
  </ActivityGrid>
)

ActList.practTypes = {
  acts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      duration: PropTypes.string
    })
  ) // optional
}

export default ActList
