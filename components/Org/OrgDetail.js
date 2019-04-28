import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import Markdown from 'markdown-to-jsx'

const OrgDetail = ({ org, ...props }) => (
  <Row type='flex' align='top'>
    <Col // these settings put the image first on narrow pages.
      sm={{ span: 24, order: 1 }}
      md={{ span: 12, order: 2 }}
    >
      <img style={{ width: '100%', maxWidth: '300px' }} src={org.imgUrl} alt={org.name} />
    </Col>
    <Col
      sm={{ span: 24, order: 2 }}
      md={{ span: 12, order: 1 }}
    >
      <h1>{org.name}</h1>
      <p>{org.type}</p>
      <h3>About</h3>
      <Markdown children={org.about || ''} />
    </Col>
  </Row>
)

OrgDetail.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default OrgDetail
