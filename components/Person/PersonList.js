/* Display a grid of People cards from an [person]
 */
import React from 'react'
import PropTypes from 'prop-types'
import PersonCard from './PersonCard'
import { Grid8 } from '../VTheme/VTheme'

const PersonList = ({ people, ...props }) => (
  <Grid8>
    {people
      ? people.map((person, index) => <PersonCard person={person} key={index} />)
      : 'No Matching People'}
  </Grid8>
)

PersonList.propTypes = {
  people: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired
    })
  ) // optional as may update later.
}

export default PersonList
