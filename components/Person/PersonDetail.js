import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Markdown from 'markdown-to-jsx'
import { FormattedMessage } from 'react-intl'
import { Row, Col } from 'antd'

const PersonDetail = ({ person }, ...props) => (

  <Row type='flex' align='top'>
    <Head title={person.nickname} />
    <Col // these settings put the image first on narrow pages.
      sm={{ span: 24, order: 1 }}
      md={{ span: 12, order: 2 }}
    >
      <img style={{ width: '100%', maxWidth: '300px' }} src={person.avatar} alt={person.nickname} />
    </Col>
    <Col
      sm={{ span: 24, order: 2 }}
      md={{ span: 12, order: 1 }}
    >
      <h1>{person.nickname}</h1>
      <p>{person.name}</p>
      <dl>
        <dt>
          <FormattedMessage
            id='phone'
            defaultMessage='phone'
            description='label for phone number on persons profile'
          />
        </dt>
        <dd>{person.phone}</dd>
        <dt>
          <FormattedMessage
            id='email'
            defaultMessage='email'
            description='label for email address on persons profile'
          />
        </dt>
        <dd>{person.email}</dd>
        <dt>
          <FormattedMessage
            id='gender'
            defaultMessage='Gender'
            description='label for Gender on persons profile'
          />
        </dt>
        <dd>{person.gender}</dd>
        <dt>
          <FormattedMessage
            id='status'
            defaultMessage='Status'
            description='label for status on persons profile'
          />
        </dt>
        <dd>{person.status}</dd>
        <dt>
          <FormattedMessage
            id='role'
            defaultMessage='Role'
            description='label for role on persons profile'
          />
        </dt>
        <dd>
          <ul>{
            person.role.map(role => (
              <li key={role}>{role}</li>
            ))
          }</ul>
        </dd>
      </dl>
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
    gender: PropTypes.string,
    avatar: PropTypes.any,
    role: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op-provider', 'volunteer', 'content-provider', 'tester'])),
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }).isRequired
}

export default PersonDetail
