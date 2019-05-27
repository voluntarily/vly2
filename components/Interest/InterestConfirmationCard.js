import React from 'react'
import { Card, Icon, Avatar, Typography } from 'antd'

import PropTypes from 'prop-types'

const { Paragraph, Title } = Typography

const { Meta } = Card

const cardHeading = {
  color: '#000000',
  fontWeight: 'bold',
  height: '50px'
}

const InterestConfirmationCard = ({ organizer, ...props }) => (
  <React.Fragment>
    <div style={{ color: 'black' }}>
      <Title>Thanks!</Title>
      <Paragraph>The organizer has been informed and will be in touch.</Paragraph>
      <Paragraph> This opportunity has been added to your activities. <br />
        If you want to learn more, contact the person below.</Paragraph>
    </div>
    <div>
      <Card style={{ width: 450, marginTop: 16, borderRadius: 8 }}>
        <Meta style={cardHeading}
          avatar={
            <Avatar src={organizer.imgUrl} />
          }
          title={organizer.name}
          description={organizer.title}
        />
        <div style={{ color: '#6549AA', marginTop: '20px' }}>
          <Icon type='mail' /> {organizer.email} <br />
          <Icon type='mobile' /> {organizer.phone}
        </div>
      </Card>
    </div>
  </React.Fragment>
)

InterestConfirmationCard.propTypes = {
  organizer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
}

export default InterestConfirmationCard
