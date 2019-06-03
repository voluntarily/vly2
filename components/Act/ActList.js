/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import ActCard from './ActCard'
import { FormattedMessage } from 'react-intl'
import { Grid } from '../VTheme/VTheme'

const ActList = ({ acts, ...props }) => (
  <Grid>
    {acts ? (
      acts.map((act, index) => <ActCard act={act} key={index} />)
    ) : (
      <FormattedMessage
        id='act.list.empty'
        defaultMessage='No matching activities'
        description='no activities message in ActList'
      />
    )}
  </Grid>
)

ActList.practTypes = {
  acts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      duration: PropTypes.string
    })
  ) // optional
}

export default ActList
