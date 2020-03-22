/*
  Display an activity record in card format with a picture, name, and commitment.
*/
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Card } from '../VTheme/VTheme'

// todo if image is not present then use a fallback.
const ActCard = ({ act, onPress, ...props }) => {
  const draft = act.status === 'draft' ? 'DRAFT: ' : ''
  const cardImage = act.imgUrl ? act.imgUrl : '/static/missingimage.svg'
  const duration = act.duration ? `⏱ ${act.duration}` : ''
  return (
    <Card>
      <Link href={`/acts/${act._id}`}>
        <a>
          <img src={cardImage} />
          <figcaption>
            <h1>
              {draft}
              {act.name}
            </h1>
            <p>{duration}</p>
            <p>{act.subtitle}</p>
          </figcaption>
        </a>
      </Link>
    </Card>
  )
}

ActCard.propTypes = {
  act: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    _id: PropTypes.string.isRequired
  }),
  onPress: PropTypes.func
}

export default ActCard
