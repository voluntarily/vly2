/*
  Display an activity record in card format with a picture, name, and commitment.
*/
// import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'
import { Card, DescriptionWrapper } from '../VTheme/VTheme'
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
  font-size: 1rem;
  margin-right: 0.5rem;

 
`
const TagInterest = styled.p`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;   

  padding:0.2rem 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 8px;
  color: white;
  background-color: #240754; 
`

// todo if image is not present then use a fallback.
const OpCard = ({ op }) => {
  const cardImage = op.imgUrl ? op.imgUrl : '/static/missingimage.svg'
  const draft = op.status === 'draft' ? 'DRAFT: ' : ''
  const isArchived = op.status === 'completed' || op.status === 'cancelled'
  const startTime = op.date[0] ? moment(op.date[0]).format('🗓 h:mmA - ddd DD/MM/YY') : ''
  const startLocation = op.location ? `📍 ${op.location}` : ''
  const startDuration = op.duration ? `⏱ ${op.duration}` : ''
  const interestIcon = ((interest) => {
    if (!interest) { return '' }
    switch (interest.status) {
      case 'interested': return <TagInterest><StyledIcon type='mail' />Offer Sent</TagInterest>
      case 'invited': return <TagInterest>Offer </TagInterest>
      case 'committed': return <StyledIcon type='check-circle' theme='twoTone' twoToneColor='#0f0' />
      case 'declined': return <StyledIcon type='close-circle' theme='twoTone' twoToneColor='#f00' />
      default: return ''
    }
  })(op.interest)

  let orgName = ''

  if (op.offerOrg) {
    orgName = <span>{op.offerOrg.name}</span>
  }

  return (
    <Card>
      <Link href={getOpPageURL(isArchived, op._id)}>
        <a>
          <ImageWrapper>
            <img src={cardImage} alt={op.name} />
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
            <DescriptionWrapper>
              {op.subtitle}
            </DescriptionWrapper>
            {orgName &&
              <>
                <DescriptionWrapper>

                  <i>
              By {orgName}
                  </i>
                </DescriptionWrapper>
              </>}

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
    date: PropTypes.arrayOf.string,
    location: PropTypes.string,
    duration: PropTypes.string,
    _id: PropTypes.string.isRequired
  })
}

export default OpCard
