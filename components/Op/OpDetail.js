/* Dumb React component Shows contents of an opportunity
 */
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Markdown from 'markdown-to-jsx'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Row } from 'antd'

export function OpDetail ({ op }) {
  return (
    <div>
      <Head>title = {op.title}</Head>
      <Row type='flex' align='top'>
        <Col // these settings put the image first on narrow pages.
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 2 }}
        >
          <img style={{ width: '100%' }} src={op.imgUrl} alt={op.title} />
        </Col>
        <Col
          sm={{ span: 24, order: 2 }}
          md={{ span: 12, order: 1 }}
        >
          <h1>{op.title}</h1>
          <p>{op.subtitle}</p>
          <dl>
            <dt>
              <FormattedMessage
                id='op.commitment'
                defaultMessage='commitment'
                description='label in opportunity e.g 2 hours commitment'
              />
            </dt><dd>{op.duration}</dd>
            <dt>location</dt><dd>{op.location}</dd>
            <dt>status</dt><dd>{op.status}</dd>
          </dl>
          <Markdown
            children={op.description}
            options={{
              overrides: {
                Button: { component: Button }
              }
            }}
          />
        </Col>
      </Row>
    </div>
  )
}

OpDetail.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })
}

export default OpDetail
