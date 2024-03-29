/*
  Display an activity record in card format with a picture, name, and commitment.
*/
// import React from 'react'
import Link from 'next/link'
import moment from 'moment'
import { Card, DescriptionWrapper, TagState } from '../VTheme/VTheme'
import {
  CheckCircleTwoTone,
  MailTwoTone,
  CalendarTwoTone,
  CloseCircleTwoTone
} from '@ant-design/icons'

import styled from 'styled-components'
import { OpTypeSuffix } from './OpType'
import { displayDuration } from '../../lib/durationUtil'

const getOpPageURL = (isArchived, opid) => {
  if (isArchived) {
    return `/archivedops/${opid}`
  } else {
    return `/ops/${opid}`
  }
}

const ImageWrapper = styled.div`
  position: relative;

`

// todo if image is not present then use a fallback.
const OpCard = ({ op }) => {
  const cardImage = op.imgUrl ? op.imgUrl : '/static/missingimage.svg'
  const draft = op.status === 'draft' ? 'DRAFT: ' : ''
  const isArchived = op.status === 'completed' || op.status === 'cancelled'
  const startTime = op.date[0] ? moment(op.date[0]).format('🗓 h:mmA - ddd DD/MM/YY') : ''
  const startLocation = op.location ? `📍 ${op.location}` : ''
  const startDuration = op.duration ? `⏱ ${displayDuration(op.duration)}` : ''
  const interestIcon = ((interest) => {
    if (!interest) { return '' }
    switch (interest.status) {
      case 'interested': return <TagState style={{ color: '#222', backgroundColor: '#E1E1E1' }}><MailTwoTone />Signed up</TagState>
      case 'invited': return <TagState style={{ color: 'white', backgroundColor: '#653CAD' }}><CalendarTwoTone />You are invited</TagState>
      case 'committed': return <TagState style={{ color: 'black', backgroundColor: '#36F482' }}><CheckCircleTwoTone />Accepted</TagState>
      case 'declined': return <TagState style={{ color: 'white', backgroundColor: '#F44336' }}><CloseCircleTwoTone />Cancelled</TagState>
      default: return ''
    }
  })(op.interest)

  // let orgName = ''

  // if (op.offerOrg) {
  //   orgName = <span>{op.offerOrg.name}</span>
  // }

  return (
    <Card>
      <Link href={getOpPageURL(isArchived, op._id)}>
        <a>
          <ImageWrapper>
            <img src={cardImage} alt={op.name} />
            {interestIcon}
            {/* <OpTypeStamp type={op.type} /> */}
          </ImageWrapper>
          <figcaption>
            <p>
              {op.requestor.nickname} <OpTypeSuffix type={op.type} />
            </p>
            <h1>
              {draft}
              {op.name}
            </h1>

            <DescriptionWrapper>
              {op.subtitle}<br />
              {/* <OpType type={op.type} /> */}
            </DescriptionWrapper>
            <ul>

              {startLocation && <li> {startLocation}</li>}
              {startTime && <li> {startTime} </li>}
              {startDuration && <li> {startDuration}</li>}
            </ul>
            <DescriptionWrapper>
              {/* {orgName &&
                <i>Via {orgName}&nbsp;</i>} */}
              <i> created {moment(op.createdAt).fromNow()}</i>
            </DescriptionWrapper>

          </figcaption>
        </a>
      </Link>
    </Card>
  )
}

export default OpCard
