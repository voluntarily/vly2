/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import Loading from '../Loading'
import OpList from './OpList'
import { OpportunityStatus, OpportunityType } from '../../server/api/opportunity/opportunity.constants.js'

import { EmptyContainer } from '../VTheme/VTheme'

import { Button } from 'antd'
import Link from 'next/link'
const { ASK, OFFER } = OpportunityType
/* ArchivedOpsSection
  shows the list of opportunities that have passed and been archived
  i.e. completed or cancelled and owned by the current person.
  it expects to find a populated list of archived opportunities
  in the redux store, placed there by the parent page
  */

const OpArchiveEmpty = ({ type }) => (
  <EmptyContainer>
    <div>
      <img src='/static/img/about/askforhelp.png' />
      <h3>
        <FormattedMessage
          id='ArchivedOpsSection.empty.title'
          defaultMessage='Activities you volunteered for in the past will show up here'
          description='title for empty op section'
        />
      </h3>
      <p>
        <FormattedMessage
          id='ArchivedOpsSection.empty.subtitle'
          defaultMessage=' In the meantime, let’s find cool ways to volunteer'
          description='title for empty op section'
        />
      </p>
      <Link href={`/a/${type === ASK ? OFFER : ASK}`}>
        <a>
          <Button type='primary' shape='round' size='large'>
            <FormattedMessage
              id='ArchivedOpsSection.empty.button'
              defaultMessage='Browse Activities'
              decription='button to update profile on empty recommendations box'
            />
          </Button>
        </a>
      </Link>
    </div>
  </EmptyContainer>
)

export const ArchivedOpsSection = () => {
  const archivedOpportunities = useSelector(
    state => state.archivedOpportunities // list of ops I own
  )
  if (!archivedOpportunities.sync) return <Loading label='archivedOpportunities' entity={archivedOpportunities} />
  const ops = archivedOpportunities.data
  if (!ops.length) return <OpArchiveEmpty />
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
