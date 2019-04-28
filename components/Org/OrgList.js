/* Display a grid of organisation cards from an [org]
 */
import React from 'react'
import PropTypes from 'prop-types'
import OrgCard from './OrgCard'
import { Row, Col } from 'antd'

const OrgList = ({ orgs, ...props }) => (
  <Row type='flex' align='top' gutter={{ xs: 8, sm: 16, md: 24 }} >
    {
      orgs ? orgs.map((org, index) => (
        <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={index} >
          <OrgCard
            org={org}
            key={index}
          />
        </Col>
      )) : 'No Organisations Yet'
    }
  </Row>
)

OrgList.propTypes = {
  orgs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      imgUrl: PropTypes.string,
      about: PropTypes.string.isRequired,
      type: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])).isRequired,
      _id: PropTypes.string.isRequired
    })
  ).isRequired
}

export default OrgList
