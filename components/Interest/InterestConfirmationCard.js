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

// BUG: [VP-182] The strings in InterestConfirmationCard  are not in FormattedMessage components.
const InterestConfirmationCard = ({ organizer, ...props }) => (
  <React.Fragment>
    <div style={{ color: 'black' }}>
      <Paragraph> This opportunity has been added to your activities. <br />
        If you want to learn more, contact the person below.</Paragraph>
    </div>
    <div>
      <Card style={{ width: 450, marginTop: 16, borderRadius: 8 }}>
        <Meta style={cardHeading}
          avatar={
            <Avatar src={organizer.avatar} />
          }
          title={organizer.name}
          description={organizer.title}
        />
        <div style={{ color: '#6549AA', marginTop: '20px' }}>
          {/* {console.log(organizer.phone)} */}
          <Icon type='mail' /><span> {organizer.email}</span><br />
          {organizer.phone && organizer.phone !== 'undefined' &&
          <span><Icon type='mobile' /> {organizer.phone}</span>}
        </div>
      </Card>
    </div>
  </React.Fragment>
)

InterestConfirmationCard.propTypes = {
  organizer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired
}

export default InterestConfirmationCard
