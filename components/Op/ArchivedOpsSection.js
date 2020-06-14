/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import Loading from '../Loading'
import OpList from './OpList'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'

/* ArchivedOpsSection
  shows the list of opportunities that have passed and been archived
  i.e. completed or cancelled and owned by the current person.
  it expects to find a populated list of archived opportunities
  in the redux store, placed there by the parent page
  */

export const ArchivedOpsSection = () => {
  const archivedOpportunities = useSelector(
    state => state.archivedOpportunities // list of ops I own
  )
  if (!archivedOpportunities.sync) return <Loading label='archivedOpportunities' entity={archivedOpportunities} />
  const ops = archivedOpportunities.data
  if (!ops.length) return <p>No istory</p>
  return (
    <>
      <ProfileSection>
        <ProfileSectionTitle>
          <FormattedMessage
            id='home.History.completedOpportunities'
            defaultMessage='Completed Activities'
            description='Subtitle for completed activites on home page history tab'
          />
        </ProfileSectionTitle>
        <OpList ops={ops.filter(op => op.status === OpportunityStatus.COMPLETED)} />
      </ProfileSection>
      <ProfileSection>
        <ProfileSectionTitle>
          <FormattedMessage
            id='home.History.cancelledOpportunities'
            defaultMessage='Cancelled Activities'
            description='Subtitle for teacher cancelled activites on home page history tab'
          />
        </ProfileSectionTitle>
        <OpList ops={ops.filter(op => op.status === OpportunityStatus.CANCELLED)} />
      </ProfileSection>
    </>
  )
}

export default ArchivedOpsSection
