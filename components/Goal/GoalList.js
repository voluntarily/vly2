/* Display a grid of goal cards from an [op]
 */
import React from 'react'
import { Grid } from '../VTheme/VTheme'
import GoalCard from '../Goal/GoalCard'

const GoalList = ({ goals }) => (
  <Grid>
    {goals.map((goal, index) => <GoalCard key={index} goal={goal} />)}
  </Grid>
)

export default GoalList
