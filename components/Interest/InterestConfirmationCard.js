import { Avatar, Card, Icon, Typography } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

const { Paragraph } = Typography
const { Meta } = Card
// page copy declared here to handle multiple lines
const interestConfirmation = {
  id: 'op.added',
  description: 'Confirms interest has been added to a persons activities',
  defaultMessage: `This opportunity has been added to your activities.
    If you want to learn more, contact the person below.`
}

const cardHeading = {
  color: '#000000',
  fontWeight: 'bold',
  height: '50px'
}

const InterestConfirmationCard = ({ organizer, ...props }) => {
  // TODO: [VP-1339] InterestConfirmationCard organizer is an id and needs to be populated.
  const emailHref = 'mailto:' + organizer.email

  return (
    <>
      <div style={{ color: 'black' }}>
        <Paragraph>
          <FormattedMessage {...interestConfirmation} />
        </Paragraph>
      </div>
      <div>
        <Card style={{ width: 450, marginTop: 16, borderRadius: 8 }}>
          <Meta
            style={cardHeading}
            imgUrl={
              <Avatar src={organizer.imgUrl} />
            }
            name={organizer.name}
            description={organizer.name}
          />
          <div style={{ color: '#6549AA', marginTop: '20px' }}>
            <Icon type='mail' /><span> <a href={emailHref}>{organizer.email}</a></span><br />
            {organizer.phone && organizer.phone !== 'undefined' &&
              <span><Icon type='mobile' /> {organizer.phone}</span>}
          </div>
        </Card>
      </div>
    </>
  )
}

InterestConfirmationCard.propTypes = {
  organizer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
}

export default InterestConfirmationCard
