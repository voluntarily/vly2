/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OpCard from './OpCard'
import { Col, Row } from 'antd'
import { FormattedMessage } from 'react-intl'

const OpList = ({ ops, ...props }) => (
  <Row type='flex' align='top' gutter={{ xs: 8, sm: 16, md: 24 }} >
    {
      ops ? ops.map((op, index) => (
        <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={index} >
          <OpCard
            op={op}
            key={index}
          />
        </Col>
      )) : <FormattedMessage id='op.list.empty' defaultMessage='No matching opportunities' description='no opportunities message in OpList' />
    }
  </Row>
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
