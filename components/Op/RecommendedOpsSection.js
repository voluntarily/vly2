import React from 'react'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import { FormattedMessage } from 'react-intl'
import { OpRecommendations, NoRecommendations } from './OpRecommendations'
import { useSelector } from 'react-redux'
import Loading from '../Loading'
import { Role } from '../../server/services/authorize/role'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { Divider } from 'antd'
const { ASK, OFFER } = OpportunityType

export const RecommendedOpsSection = () => {
  const [me, recommendedOps] = useSelector(state => [state.session.me, state.recommendedOps])
  if (!recommendedOps.sync) return <Loading label='recommended activities' entity={recommendedOps} />

  const vp = me.role.includes(Role.VOLUNTEER)
  const bp = me.role.includes(Role.BASIC)
  const ops = recommendedOps.data[0]

  return (
    <>
      {!vp && !bp &&
        <NoRecommendations />}

      {vp &&
        <>
          <ProfileSection id='volunteerRecommendations'>
            <ProfileSectionTitle>
              <FormattedMessage
                id='recommendedOpsSection.title.volunteer'
                defaultMessage='Discover ways to help out'
                decription='Title on volunteer home page for recommended opportunities'
              />

            </ProfileSectionTitle>

            <OpRecommendations recommendedOps={ops} type={ASK} />

          </ProfileSection>
          <Divider />
        </>}

      {bp &&
        <ProfileSection id='basicRecommendations'>
          <ProfileSectionTitle>
            <FormattedMessage
              id='recommendedOpsSection.title'
              defaultMessage='People offering help'
              decription='Title on volunteer home page for recommended opportunities'
            />
            <small>
              <FormattedMessage
                id='recommendedOpsSection.subtitle'
                defaultMessage='Here are some opportunities volunteers are offering'
                decription='Subtitle on volunteer home page for recommended opportunities'
              />
            </small>
          </ProfileSectionTitle>

          <OpRecommendations recommendedOps={ops} type={OFFER} />
        </ProfileSection>}

    </>
  )
}

export default RecommendedOpsSection
