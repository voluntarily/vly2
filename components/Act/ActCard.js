/*
  Display an activity record in card format with a picture, name, and commitment.
*/
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Card } from '../VTheme/VTheme'
import { OpCommitment } from '../Op/OpType'
import { OpStatusStamp, OpStatus } from '../Op/OpStatus'

// todo if image is not present then use a fallback.
const ActCard = ({ act, onPress, ...props }) => {
  const cardImage = act.imgUrl ? act.imgUrl : '/static/missingimage.svg'
  return (
    <Card style={{ height: '25rem', overflow: 'auto' }}>
      <Link href={`/acts/${act._id}`}>
        <a>
          <div>
            <OpStatusStamp status={act.status} />
            <img src={cardImage} />
          </div>
          <figcaption>
            <h1>
              <OpStatus status={act.status} />
              {act.name}
            </h1>
            <p>{act.subtitle}</p>
            <ul>
              <li><OpCommitment duration={act.duration} /></li>
            </ul>
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
    opCounts: PropTypes.object,
    _id: PropTypes.string.isRequired
  }),
  onPress: PropTypes.func
}

export default ActCard
