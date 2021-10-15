/*
  Display an activity record in card format with a picture, name, and commitment.
*/
// import React from 'react'
import Link from 'next/link'
import moment from 'moment'
import { SmallCard, SmallOpGrid, TagState } from '../VTheme/VTheme'
import { Image, Divider } from 'antd'
import {
  CheckCircleTwoTone,
  MailTwoTone,
  CalendarTwoTone,
  CloseCircleTwoTone
} from '@ant-design/icons'

import { OpType } from './OpType'
const getOpPageURL = (isArchived, opid) => {
  if (isArchived) {
    return `/archivedops/${opid}`
  } else {
    return `/ops/${opid}`
  }
}

// todo if image is not present then use a fallback.
const OpCardSmall = ({ op }) => {
  const isArchived = op.status === 'completed' || op.status === 'cancelled'
  const startTime = op.date[0] ? moment(op.date[0]).format('🗓 ddd DD/MM/YY') : null

  const startLocation = op.location ? `📍 ${op.location}` : ''
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
    <SmallCard style={{ minHeight: '10rem' }}>
      <Link href={getOpPageURL(isArchived, op._id)}>
        <a>
          <p>

            {!op.description && <>{op.requestor.nickname} <OpType type={op.type} /> with {op.name}</>}
            {op.description}
          </p>

          <Divider />
          <SmallOpGrid>
            <Image alt='requestor icon' src={op.requestor.imgUrl} />
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

export default OpCardSmall
