/* Display a grid of People cards from an [person]
 */
import React from 'react'
import { TripleGrid } from '../VTheme/VTheme'
import PersonListItem from './PersonListItem'

const PersonList = ({ people, ...props }) => (
  <TripleGrid>
    {people
      ? people.map((person, index) => <PersonListItem person={person} key={index} />)
      : 'No Matching People'}
  </TripleGrid>
)

export default PersonList
