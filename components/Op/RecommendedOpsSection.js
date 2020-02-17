import React from 'react'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import { FormattedMessage } from 'react-intl'
import OpRecommendations from './OpRecommendations'
import { useSelector } from 'react-redux'
import Loading from '../Loading'

export const RecommendedOpsSection = () => {
  const recommendedOps = useSelector(state => state.recommendedOps)
  console.log(recommendedOps)
  if (!recommendedOps.sync) return <Loading />
  const ops = recommendedOps.data[0]

  return (
    <ProfileSection>
      <ProfileSectionTitle>
        <FormattedMessage
          id='recommendedOpsSection.title'
          defaultMessage='Recommended for You'
          decription='Title on volunteer home page for recommended opportunities'
        />
      </ProfileSectionTitle>
      <p>
        <FormattedMessage
          id='recommendedOpsSection.subtitle'
          defaultMessage='Here are some opportunities we think you might like'
          decription='Subtitle on volunteer home page for recommended opportunities'
        />
      </p>
      <OpRecommendations
        recommendedOps={ops}
      />
    </ProfileSection>)
}

export default RecommendedOpsSection
