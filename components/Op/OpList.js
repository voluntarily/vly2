/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OpCard from './OpCard'
import { FormattedMessage } from 'react-intl'
import { Row, Col } from 'antd'
import styled from 'styled-components'

const CardWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px;
`

const OpList = ({ ops, ...props }) => (
  <Row>
    {ops ? (
      ops.map((op, index) =>
        <Col key={index} xs={24} md={12} lg={8} xl={6}>
          <CardWrapper>
            <OpCard size='Small' op={op} />
          </CardWrapper>
        </Col>)
    ) : (
      <FormattedMessage
        id='op.list.empty'
        defaultMessage='No matching opportunities'
        description='no opportunities message in OpList'
      />
    )}
  </Row>
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
