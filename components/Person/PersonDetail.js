import { Col, Icon, Row } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import PersonRoles from './PersonRole'

const DL = styled.dl`

dt {
  float: left;
  clear: left;
  padding: 2px 4px;
  text-align: right;
}
dd {
  margin: 0;
  padding: 2px 4px;
}
`
const PersonDetail = ({ person }, ...props) => (

  <Row type='flex' align='top'>
    <Head title={person.nickname} />
    <Col // these settings put the image first on narrow pages.
      sm={{ span: 24, order: 1 }}
      md={{ span: 12, order: 2 }}
    >
      <img style={{ margin: '1rem', width: '100%', maxWidth: '300px' }} src={person.avatar} alt={person.nickname} />
    </Col>
    <Col
      sm={{ span: 24, order: 2 }}
      md={{ span: 12, order: 1 }}
    >
      <h1>{person.nickname}</h1>
      <p>{person.name}</p>
      <DL>
        <dt>
          <Icon type='phone' />
        </dt>
        <dd>{person.phone}</dd>
        <dt>
          <Icon type='mail' />
        </dt>
        <dd>{person.email}</dd>
        <dt>
          <Icon type='compass' />
        </dt>
        <dt>
          <Icon type='user' />
        </dt>
        <dd>{person.pronoun}</dd>
        <dt>
          <Icon type='schedule' />
        </dt>
        <dd>{person.status ? <Icon type='check' /> : <Icon type='close' />}</dd>
        <dt>
          <Icon type='coffee' />
        </dt>
        <dd>
          <PersonRoles roles={person.role} />
        </dd>
      </DL>
      <h3>About</h3>
      <Markdown children={person.about || ''} />
    </Col>
  </Row>
)

PersonDetail.propTypes = {
  person: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    about: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    pronoun: PropTypes.string,
    avatar: PropTypes.any,
    role: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'opportunityProvider', 'volunteer', 'activityProvider', 'tester'])),
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }).isRequired
}

export default PersonDetail
