/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OpCard from './OpCard'
import { FormattedMessage } from 'react-intl'
import { Grid } from '../VTheme/VTheme'

const OpList = ({ ops, ...props }) => (
  <Grid>
    {ops ? (
      ops.map((op, index) => <OpCard op={op} key={index} />)
    ) : (
      <FormattedMessage
        id='op.list.empty'
        defaultMessage='No matching opportunities'
        description='no opportunities message in OpList'
      />
    )}
  </Grid>
)

OpList.propTypes = {
  ops: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      duration: PropTypes.string
    })
  ) // optional
}

export default OpList
