/*
  Display an activity record in card format with a picture, name, and commitment.
*/
import React from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Card } from '../VTheme/VTheme'
import { OpTypeCount, OpCommitment } from '../Op/OpType'
import { OpStatusStamp, OpStatus } from '../Op/OpStatus'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType;

const LogoContainer = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
`

const Logo = styled.img`
  transform: scale(0.5);
  margin-left: 4.7rem;
  margin-top: -1rem;
`

const gra = (min, max) => { return (Math.round(Math.random() * (max - min) + min)) }

// todo if image is not present then use a fallback.
const ActCard = ({ act, onPress, ...props }) => {
  console.log('act', act);
  const cardImage = act.imgUrl ? act.imgUrl : '/static/missingimage.svg'
  return (
    <Card style={{ height: '21rem', overflow: 'auto' }}>
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
              {/* <li><OpTypeCount counts={act.opCounts} type={ASK} /></li>
              <li><OpTypeCount counts={act.opCounts} type={OFFER} /></li> */}
              <li>{`Positions available ${act.opCounts.ask > 1 ? `across ${act.opCounts.ask} locations` : `at 1 location`}`}</li>
              <li><OpCommitment duration={act.duration} /></li>
            </ul>
            {/* <LogoContainer>
              <Logo src={`https://logoipsum.com/assets/logo/logo-${gra(1, 12)}.svg`} />
            </LogoContainer> */}
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
