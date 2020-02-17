/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import { useSelector } from 'react-redux'
import { PersonalGoalStatus } from '../../server/api/personalGoal/personalGoal.constants'
import { createSelector } from 'reselect'
import GoalSection from './GoalSection'

/* PersonalGoalSection expects to find a populated list of personal goals
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

export const PersonalGoalSection = () => {
  const goals = useSelector(selectGoals)
  return <GoalSection goals={goals} />
}

export default PersonalGoalSection
