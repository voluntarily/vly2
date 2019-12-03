/* Display a grid of goal cards from an [op]
 */
import React from 'react'
import { Grid } from '../VTheme/VTheme'
import GoalCard from '../Goal/GoalCard'

const GoalList = ({ goals }) => (
  <Grid>
    {goals.map(goal => <GoalCard key={goal.slug} goal={goal} />)}
  </Grid>
)

export default GoalList
