/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OpCard from './OpCard'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Grid } from '../VTheme/VTheme'

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: visible;
`

const OpList = ({ ops, ...props }) => (
  <Grid>
    {ops ? (
      ops.map((op, index) =>
        <CardWrapper key={index}>
          <OpCard size='Small' op={op} />
        </CardWrapper>
      )
    ) : (
      <FormattedMessage
        id='OpList.NoMatchingActivities'
        defaultMessage='No matching activities'
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
