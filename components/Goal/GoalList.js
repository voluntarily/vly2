/* Display a grid of goal cards from an [op]
 */
import React from 'react'
import GoalCard from '../Goal/GoalCard'

const GoalList = ({ goals }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
    {goals.map((goal, index) => <GoalCard key={index} goal={goal} />)}
  </div>
)

export default GoalList
