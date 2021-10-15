/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import { createSelector } from 'reselect'
import Loading from '../Loading'
import OpList from './OpList'
import { InterestStatus } from '../../server/api/interest/interest.constants'
/* ArchivedInterestedOpsSection
  shows the list of opportunities currently completed
  and followed by the current person.
  it expects to find a populated list of archived interests
  in the redux store, placed there by the parent page
  */

const selectArchivedInterestedOps = createSelector(
  state => state.interestArchives,
  interests => interests.data
    .filter(interest => [InterestStatus.COMMITTED, InterestStatus.ATTENDED].includes(interest.status))
    .map((interest) => {
      interest.opportunity.interest = {
        _id: interest._id,
        status: interest.status,
        comment: interest.comment
      }
      return interest.opportunity
    })
)

export const ArchivedInterestedOpsSection = () => {
  const interestArchives = useSelector(state => state.interestArchives)
  const ops = useSelector(selectArchivedInterestedOps)
  if (!interestArchives.sync) return <Loading label='interestArchives' entity={interestArchives} />

  if (!ops.length) return null
  return (
    <ProfileSection>
      <ProfileSectionTitle>
        <FormattedMessage
          id='home.History.attendedOpportunities'
          defaultMessage='Attended Activities'
          description='Subtitle for volunteer attended activites on home page history tab'
        />
      </ProfileSectionTitle>
      <OpList ops={ops} />
    </ProfileSection>
  )
}

export default ArchivedInterestedOpsSection
