/*
  Display an activity record in card format with a picture, name, and commitment.
*/
// import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'
import { SmallCard, SmallOpGrid, TagState } from '../VTheme/VTheme'
import { Icon, Divider } from 'antd'
import styled from 'styled-components'
import { OpType } from './OpType'
const getOpPageURL = (isArchived, opid) => {
  if (isArchived) {
    return `/archivedops/${opid}`
  } else {
    return `/ops/${opid}`
  }
}

const StyledIcon = styled(Icon)`
  font-size: 1rem;
  margin-right: 0.5rem; 
`

// todo if image is not present then use a fallback.
const OpCardSmall = ({ op }) => {
  const isArchived = op.status === 'completed' || op.status === 'cancelled'
  const startTime = op.date[0] ? moment(op.date[0]).format('🗓 ddd DD/MM/YY') : null

  const startLocation = op.location ? `📍 ${op.location}` : ''
  // const startDuration = op.duration ? `⏱ ${op.duration}` : ''
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

  return (
    <SmallCard style={{ minHeight: '10rem' }}>
      <Link href={getOpPageURL(isArchived, op._id)}>
        <a>
          <p>

            {!op.description && <>{op.requestor.nickname} <OpType type={op.type} /> with {op.name}</>}
            {op.description}
          </p>

          <Divider />
          <SmallOpGrid>
            <img src={op.requestor.imgUrl} />
            <figcaption>
              {/* <p>  {op.subtitle}</p> */}
              <ul>
                <li> <strong>{op.requestor.nickname} <OpType type={op.type} /></strong></li>
                <li>   {startTime && <p>{startTime}</p>}  {startLocation && <p>{startLocation}</p>}

                </li>
                {/* {startDuration && <li> {startDuration}</li>} */}
                {op.createdAt && <li><i>Created {moment(op.createdAt).fromNow()}</i></li>}
              </ul>
              {interestIcon}
            </figcaption>
          </SmallOpGrid>
        </a>
      </Link>
    </SmallCard>
  )
}

OpCardSmall.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    imgUrl: PropTypes.any,
    date: PropTypes.arrayOf.string,
    location: PropTypes.string,
    duration: PropTypes.string,
    requestor: PropTypes.object,
    _id: PropTypes.string.isRequired
  })
}

export default OpCardSmall
