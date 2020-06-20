/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import Loading from '../Loading'
import OpList from './OpList'
import { Divider, Button } from 'antd'
import Link from 'next/link'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'

import { createSelector } from 'reselect'
import { EmptyContainer } from '../VTheme/VTheme'
const { ASK, OFFER } = OpportunityType
/* ActiveOpsSection
  shows the list of opportunities currently in draft and active mode
  and owned by the current person.
  it expects to find a populated list of opportunities
  in the redux store, placed there by the parent page
  */
const selectInterestedOps = createSelector(
  state => state.interests,
  interests => interests.data
    .map((interest, index) => {
      if (!interest.opportunity || typeof interest.opportunity === 'string') {
        return null
      } else {
        interest.opportunity.interest = {
          _id: interest._id,
          status: interest.status,
          comment: interest.comment
        }
        return interest.opportunity
      }
    })

)

const OpEmpty = ({ type }) => (
  <EmptyContainer>
    <div>
      <img src='/static/img/about/askforhelp.png' />
      <h3>
        <FormattedMessage
          id='ActiveOpsSection.empty.title'
          defaultMessage="You haven't signed up for anything yet"
          description='title for empty op section'
        />
      </h3>
      <p>
        <FormattedMessage
          id='ActiveOpsSection.empty.subtitle'
          defaultMessage=' Let’s find cool ways to volunteer'
          description='title for empty op section'
        />
      </p>
      <Link href={`/a/${type === ASK ? OFFER : ASK}`}>
        <a>
          <Button type='primary' shape='round' size='large'>
            <FormattedMessage
              id='ActiveOpsSection.empty.button'
              defaultMessage='Browse Activities'
              decription='button to update profile on empty recommendations box'
            />
          </Button>
        </a>
      </Link>
    </div>
  </EmptyContainer>
)

export const ActiveOpsSection = () => {
  const opportunities = useSelector(
    state => state.opportunities // list of ops I own
  )

  if (!opportunities.sync) return <Loading label='opportunities' entity={opportunities} />
  const ops = opportunities.data
  const InterestOps = useSelector(selectInterestedOps)
  if (!ops.length && !InterestOps.length) {
    return (
      <OpEmpty />

    )
  }
  if (ops.length) {
    return (
      <>
        <ProfileSection>
          <ProfileSectionTitle>
            <FormattedMessage
              id='ActiveOpsSection.title'
              defaultMessage='Upcoming Activities'
              description='Subtitle for home page for active opportunities that have been hosted'
            />

          </ProfileSectionTitle>
          <OpList ops={ops} />
        </ProfileSection>
        <Divider />
      </>
    )
  }
  return null
}

export default ActiveOpsSection
