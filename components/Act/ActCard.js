/*
  Display an activity record in card format with a picture, name, and commitment.
*/
import React from 'react'
import Link from 'next/link'
import { Card } from '../VTheme/VTheme'
import { OpTypeCount, OpCommitment } from '../Op/OpType'
import { OpStatusStamp, OpStatus } from '../Op/OpStatus'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

// todo if image is not present then use a fallback.
const ActCard = ({ act, onPress, ...props }) => {
  const cardImage = act.imgUrl ? act.imgUrl : '/static/missingimage.svg'
  return (
    <Card style={{ height: '25rem', overflow: 'auto' }}>
      <Link href={`/acts/${act._id}`}>
        <a>
          <div>
            <OpStatusStamp status={act.status} />
            <img alt='activity illustration' src={cardImage} />
          </div>
          <figcaption>
            <h1>
              <OpStatus status={act.status} />
              {act.name}
            </h1>
            <p>{act.subtitle}</p>
            <ul>
              <li><OpTypeCount counts={act.opCounts} type={ASK} /></li>
              <li><OpTypeCount counts={act.opCounts} type={OFFER} /></li>
              <li><OpCommitment duration={act.duration} /></li>
            </ul>
          </figcaption>
        </a>
      </Link>
    </Card>
  )
}

export default ActCard
