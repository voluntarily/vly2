/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import GoalList from '../Goal/GoalList'
import { FormattedMessage } from 'react-intl'
import { goalGroupHeading } from './GoalGroupHeading'
import { useSelector } from 'react-redux'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import { PersonalGoalStatus } from '../../server/api/personalGoal/personalGoal.constants'
import { createSelector } from 'reselect'

/* GoalSection expects to find a populated list of personal goals
  in the redux store, placed there by the parent page
  */
const selectGoals = createSelector(
  state => state.personalGoals,
  personalGoals => personalGoals.data
    .filter(pg => pg.status !== PersonalGoalStatus.HIDDEN)
    .map(pg => {
      return ({
        ...pg.goal,
        personalGoal: pg,
        status: pg.status
      })
    })
)

export const GoalSection = () => {
  const goals = useSelector(selectGoals)

  if (!goals.length) return null
  const heading = goalGroupHeading(goals[0].group)
  return (
    <ProfileSection>
      <ProfileSectionTitle>
        <FormattedMessage {...heading.title} />
        <h5><FormattedMessage {...heading.subtitle} /></h5>
      </ProfileSectionTitle>
      <GoalList goals={goals} />
    </ProfileSection>
  )
}

export default GoalSection
