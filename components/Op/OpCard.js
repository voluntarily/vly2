/*
  Display an activity record in card format with a picture, name, and commitment.
*/
// import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'
import { Card } from '../VTheme/VTheme'

const getOpPageURL = (isArchived, opid) => {
  if (isArchived) {
    return `/archivedops/${opid}`
  } else {
    return `/ops/${opid}`
  }
}
// todo if image is not present then use a fallback.
const OpCard = ({ op }) => {
  const cardImage = op.imgUrl ? op.imgUrl : '.././static/missingimage.svg'
  const draft = op.status === 'draft' ? 'DRAFT: ' : ''
  const isArchived = op.status === 'completed' || op.status === 'cancelled'
  const interestState = op.interest ? ` - ${op.interest.status}` : ''
  const startTime = op.date[0] ? moment(op.date[0]).format('🗓 h:mmA - ddd DD/MM/YY') : ''
  const startLocation = op.location ? `🏫 ${op.location}` : ''
  const startDuration = op.duration ? `⏱ ${op.duration}` : ''
  return (
    <Card>
      <Link href={getOpPageURL(isArchived, op._id)}>
        <a>
          <img src={cardImage} />
          <figcaption>
            <h1>
              {draft}
              {op.name}
            </h1>
            <p> {startLocation}</p>
            <p> {startTime} </p>
            <p> {startDuration}</p>
            <p>
              {op.subtitle}
              <strong>{interestState}</strong>
            </p>
          </figcaption>
        </a>
      </Link>
    </Card>
  )
}

OpCard.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    _id: PropTypes.string.isRequired
  })
}

export default OpCard
