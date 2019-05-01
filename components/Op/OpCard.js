/*
  Display an activity record in card format with a picture, title, and commitment.
*/
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Card } from 'antd'
import { FormattedMessage } from 'react-intl'

// todo if image is not present then use a fallback.
const OpCard = ({ op, onPress, ...props }) => (
  <Link href={`/ops/${op._id}`} >
    <Card
      cover={<img src={op.imgUrl} alt={op.title} />}
      onClick={onPress}
      style={{ marginBottom: '2em' }}
      {...props}
    >
      <Card.Meta
        title={op.title}
        description={op.subtitle}
      />
      <br />
      <p>
        {op.duration}&nbsp;
        <FormattedMessage
          id='commitment'
          defaultMessage='commitment'
          description='label in opportunity e.g 2 hours commitment'
        />
        <br />
        {op.location}
      </p>
    </Card>
  </Link>
)

OpCard.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    _id: PropTypes.string.isRequired
  }),
  onPress: PropTypes.func
}

export default OpCard
