import React from 'react'
import {Card, Icon, Avatar, Typography} from 'antd'

import PropTypes from 'prop-types'

const { Paragraph, Title } = Typography

const {Meta} = Card

const cardHeading = {
  color: '#000000',
  fontWeight: 'bold',
  height: '50px'
}

const ConfirmationCard = ({person, ...props}) => (
  <React.Fragment>
    <div style={{color: 'black'}}>
      <Title>Thanks!</Title>
      <Paragraph>The organizer has been informed and will be in touch.</Paragraph>
      <Paragraph> This opportunity has been added to your activities. <br/>
        If you want to learn more, contact the person below.</Paragraph>
    </div>
    <div>
      <Card style={{width: 450, marginTop: 16, borderRadius: 8}}>
        <Meta style={cardHeading}
          avatar={
            <Avatar src={person.imgUrl} />
          }
          title={person.name}
          description={person.title}
        />
        <div style={{color: '#6549AA', marginTop: '20px'}}>
          <Icon type='mail' /> {person.email} <br/>
          <Icon type='mobile' /> {person.phone}
        </div>
      </Card>
    </div>
  </React.Fragment>
)

ConfirmationCard.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
}

export default ConfirmationCard
