/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OpCardSmall from './OpCardSmall'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: visible;
`
const CardContainer = styled.div`

overflow: visible;
  display:grid;
  grid-template-columns: 1fr;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  

`

const OpList = ({ ops }) => (
  <CardContainer>
    {ops
      ? (
          ops.map((op, index) =>
            <CardWrapper key={index}>
              <OpCardSmall size='Small' op={op} />
            </CardWrapper>
          )
        )
      : (
        <FormattedMessage
          id='OpListSmall.NoMatchingActivities'
          defaultMessage='No matching activities'
          description='no opportunities message in OpList'
        />
        )}
  </CardContainer>
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
