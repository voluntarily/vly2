/*
  Display an activity record in card format with a picture, name, and commitment.
*/
// import React from 'react'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'
import { SmallCard, SmallOpGrid, TagState } from '../VTheme/VTheme'
import { Icon, Button, notification } from 'antd'
import styled from 'styled-components'
import RegisterInterestMessageForm from '../Interest/RegisterInterestMessageForm'
import { OpType } from './OpType'
const getOpPageURL = (isArchived, opid) => {
  if (isArchived) {
    return `/archivedops/${opid}`
  } else {
    return `/ops/${opid}`
  }
}

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`

const PositionsAvailableText = styled.div`
  margin-bottom: 14px;
  font-size: 12pt;
`

const StyledIcon = styled(Icon)`
  font-size: 1rem;
  margin-right: 0.5rem; 
`
const SingleLineTitle = styled('h2')`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
// todo if image is not present then use a fallback.
const OpCardSmall = ({ op }) => {

  const [showAcceptForm, setShowAcceptForm] = useState(false);

  const handleApplyClick = (e) => {
    e.preventDefault();
    setShowAcceptForm(true);
  }

  const handleAcceptSubmit = (ok, message) => {
    setShowAcceptForm(false)
    if (ok) {
      //TODO

      // onAccept(message)
      // if (options.acceptNotifyHeading) {
      //   notification.success({
      //     message: options.acceptNotifyHeading,
      //     description: options.acceptNotifyMessage
      //   })
      // }
    }
  }

  const isArchived = op.status === 'completed' || op.status === 'cancelled'
  const startTime = op.date[0] ? moment(op.date[0]).format('🗓 h:mmA - ddd DD/MM/YY') : ''
  const startLocation = op.location ? `📍 ${op.location}` : ''
  const startDuration = op.duration ? ` ${op.duration}` : ''
  const interestIcon = ((interest) => {
    if (!interest) { return '' }
    switch (interest.status) {
      case 'interested': return <TagState style={{ color: '#222', backgroundColor: '#E1E1E1' }}><StyledIcon type='mail' />You offered to help</TagState>
      case 'invited': return <TagState style={{ color: 'white', backgroundColor: '#653CAD' }}><StyledIcon type='calendar' />You are invited</TagState>
      case 'committed': return <TagState style={{ color: 'black', backgroundColor: '#36F482' }}><StyledIcon type='check-circle' />Accepted</TagState>
      case 'declined': return <TagState style={{ color: 'white', backgroundColor: '#F44336' }}><StyledIcon type='close-circle' />Cancelled</TagState>
      default: return ''
    }
  })(op.interest)

  // let orgName = ''

  // if (op.offerOrg) {
  //   orgName = <span>{op.offerOrg.name}</span>
  // }

  console.log('op', op);

  return (
    <>
      <RegisterInterestMessageForm
        id='acceptRegisterInterestForm'
        title={`Apply for position: ${op.name}`}
        prompt={'Please provide a message to support your application.'}
        showTerms={false}
        onSubmit={handleAcceptSubmit}
        visible={showAcceptForm}
      />
      <SmallCard style={{ height: '10rem' }} onClick={handleApplyClick}>
        {/* <Link href={getOpPageURL(isArchived, op._id)}> */}
          <a>
            <SingleLineTitle>
              {op.location}
              {/* {op.requestor.nickname} <OpType type={op.type} /> */}
            </SingleLineTitle>
            <CardContent>
            <PositionsAvailableText>{op.subtitle}</PositionsAvailableText>
              <Button
                id='applyButton'
                name='apply'
                size='large'
                shape='round'
                type='primary'
                onClick={handleApplyClick}
              >
                Apply
              </Button>
              
          </CardContent>
            {/* <SmallOpGrid>
              <img src={op.requestor.imgUrl} />
              <figcaption>
                <ul>
                  {startLocation && <li> {startLocation}</li>}
                  {startTime && <li> {startTime} </li>}
                  {startDuration && <li> {startDuration}</li>}
                  {op.createdAt && <li>{op.createdAt}</li>}
                </ul>
                {interestIcon}
              </figcaption>
            </SmallOpGrid> */}
          </a>
        {/* </Link> */}
      </SmallCard>
    </>
  )
}

OpCardSmall.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    date: PropTypes.arrayOf.string,
    location: PropTypes.string,
    duration: PropTypes.string,
    requestor: PropTypes.object,
    _id: PropTypes.string.isRequired
  })
}

export default OpCardSmall
