/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import { createSelector } from 'reselect'
import Loading from '../Loading'
import OpList from './OpList'
import { Divider } from 'antd'

/* InterestedOpsSection
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

export const InterestedOpsSection = () => {
  const interests = useSelector(state => state.interests)
  const ops = useSelector(selectInterestedOps)
  if (!interests.sync) return <Loading label='Interests' entity={interests} />

  if (!ops.length) return null
  return (
    <>
      <ProfileSection>
        <ProfileSectionTitle>
          <FormattedMessage
            id='interestedOpsSection.title'
            defaultMessage='You signed up for'
            description='Subtitle for home page for the volunteers current ops'
          />
        </ProfileSectionTitle>
        <OpList ops={ops} />
      </ProfileSection>
      <Divider />
    </>
  )
}

export default InterestedOpsSection
