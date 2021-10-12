import React from 'react'
import PropTypes from 'prop-types'
import OpList from './OpList'
import { FormattedMessage } from 'react-intl'
import { Button, Empty } from 'antd'
import Link from 'next/link'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

export const NoRecommendations = ({ type }) =>
  <Empty
    image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
    imageStyle={{
      height: 60
    }}
    description={
      <>
        <h2>
          <FormattedMessage
            id='NoRecommendations.title'
            defaultMessage='So much empty!'
            decription='title on empty recommendations box'
          />
        </h2>
        <br />
        <span>
          <FormattedMessage
            id='NoRecommendations.prompt'
            defaultMessage="Either everyone is sorted or we don't know enough about you yet. Complete your profile or browse for new activities."
            decription='prompt on empty recommendations box'
          />
        </span>
      </>
    }
  >
    <>
      <a href='/home?tab=profile'>
        <Button type='primary' shape='round'>
          <FormattedMessage
            id='NoRecommendations.button.profile'
            defaultMessage='Update your profile'
            decription='button to update profile on empty recommendations box'
          />
        </Button>
      </a>&nbsp;
      {/* invert the type to switch from listing to doing */}
      {type &&
        <Link href={`/acts/type/${type === ASK ? OFFER : ASK}`}>
          <Button type='primary' shape='round'>
            <FormattedMessage
              id='NoRecommendations.button.browse'
              defaultMessage='Browse Activities'
              decription='button to update profile on empty recommendations box'
            />
          </Button>
        </Link>}
    </>
  </Empty>

export const OpRecommendations = ({ type, recommendedOps }) => {
  const locs = recommendedOps.basedOnLocation.filter(op => op.type === type)
  const skills = recommendedOps.basedOnSkills.filter(op => op.type === type)
  return (
    <>
      {locs.length !== 0 &&
        <>
          <h3>
            <FormattedMessage
              id='OpRecommendations.sectiontitle.basedOnLocation'
              defaultMessage='Based on your locations'
            />
          </h3>
          <OpList ops={locs} />
        </>}

      {skills.length !== 0 &&
        <>
          <h3>
            <FormattedMessage
              id='OpRecommendations.sectiontitle.basedOnSkills'
              defaultMessage='Based on your preferences'
            />
          </h3>
          <OpList ops={skills} />
        </>}
      {locs.length === 0 && skills.length === 0 &&
        <NoRecommendations type={type} />}
    </>)
}

OpRecommendations.propTypes = {
  recommendedOps: PropTypes.shape({
    basedOnLocation: PropTypes.array,
    basedOnSkills: PropTypes.array
  }).isRequired
}

export default OpRecommendations
