import { Avatar, Card, Icon, Typography } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

const { Paragraph } = Typography
const { Meta } = Card
// page copy declared here to handle multiple lines
const memberConfirmation = {
  id: 'member.added',
  description: 'Confirms member has been added to an organisation',
  defaultMessage: `You have been confirmed as a member of this organisation.
    If you want to learn more, contact the person below.`
}

const cardHeading = {
  color: '#000000',
  fontWeight: 'bold',
  height: '50px'
}

const MemberConfirmationCard = ({ orgAdmin, ...props }) => {
  const emailHref = 'mailto:' + orgAdmin.email

  return (
    <React.Fragment>
      <div style={{ color: 'black' }}>
        <Paragraph>
          <FormattedMessage {...memberConfirmation} />
        </Paragraph>
      </div>
      <div>
        <Card style={{ width: 450, marginTop: 16, borderRadius: 8 }}>
          <Meta style={cardHeading}
            avatar={
              <Avatar src={orgAdmin.avatar} />
            }
            title={orgAdmin.name}
            description={orgAdmin.title}
          />
          <div style={{ color: '#6549AA', marginTop: '20px' }}>
            {/* {console.log(orgAdmin.phone)} */
            }
            <Icon type='mail' /><span> <a href={emailHref}>{orgAdmin.email}</a></span><br />
            {orgAdmin.phone && orgAdmin.phone !== 'undefined' &&
            <span><Icon type='mobile' /> {orgAdmin.phone}</span>}
          </div>
        </Card>
      </div>
    </React.Fragment>
  )
}

MemberConfirmationCard.propTypes = {
  orgAdmin: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string
  }).isRequired
}

export default MemberConfirmationCard
