/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OpCard from './OpCard'
import { FormattedMessage } from 'react-intl'
import { Grid } from '../VTheme/VTheme'

const filterInterestsToOp = (op) => {
  return (interest) => {
    return (op._id === interest.opportunity)
  }
}

const OpList = ({ ops, interests, ...props }) => (
  <Grid>
    {ops ? (
      ops.map((op, index) => {
        let filteredInterests = interests ? interests.filter(filterInterestsToOp(op)) : []
        let interestStatus = filteredInterests[0] ? filteredInterests[0].status : ''
        return <OpCard size='Small' op={op} interestStatus={interestStatus} key={index} />
      })
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
      name: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      duration: PropTypes.string
    })
  ) // optional
}

export default OpList
