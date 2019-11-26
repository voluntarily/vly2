/*
  Display an activity record in card format with a picture, name, and commitment.
*/
// import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'
import { Card } from '../VTheme/VTheme'
import { Icon } from 'antd'
import styled from 'styled-components'

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

const StyledIcon = styled(Icon)`
  font-size: 2rem;
  position: absolute;
  top: 1rem;
  right: 2rem;    
`

// todo if image is not present then use a fallback.
const OpCard = ({ op }) => {
  const cardImage = op.imgUrl ? op.imgUrl : '.././static/missingimage.svg'
  const draft = op.status === 'draft' ? 'DRAFT: ' : ''
  const isArchived = op.status === 'completed' || op.status === 'cancelled'
  const startTime = op.date[0] ? moment(op.date[0]).format('🗓 h:mmA - ddd DD/MM/YY') : ''
  const startLocation = op.location ? `🏫 ${op.location}` : ''
  const startDuration = op.duration ? `⏱ ${op.duration}` : ''
  const interestIcon = ((interest) => {
    if (!interest) { return '' }
    switch (interest.status) {
      case 'interested': return <StyledIcon type='like' theme='twoTone' twoToneColor='#6549AA' />
      case 'invited': return <StyledIcon type='message' theme='twoTone' twoToneColor='#fb0' />
      case 'committed': return <StyledIcon type='check-circle' theme='twoTone' twoToneColor='#0f0' />
      case 'declined': return <StyledIcon type='close-circle' theme='twoTone' twoToneColor='#f00' />
      default: return ''
    }
  })(op.interest)

  return (
    <Card>
      <Link href={getOpPageURL(isArchived, op._id)}>
        <a>
          <ImageWrapper>
            <img src={cardImage} />
            {interestIcon}
          </ImageWrapper>
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
