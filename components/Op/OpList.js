/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OpCard from './OpCard'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
export const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 18.5rem 18.5rem 18.5rem 18.5rem;
  grid-gap: 2rem;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, 18.5rem);
    justify-content: start;
    justify-items: center;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: 100vw;
    grid-gap: 0rem;
  }
` // end grid

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
