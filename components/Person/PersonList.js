/* Display a grid of People cards from an [person]
 */
import React from 'react'
import PropTypes from 'prop-types'
import { TripleGrid } from '../VTheme/VTheme'
import PersonListItem from './PersonListItem'

const PersonList = ({ people, ...props }) => (
  <TripleGrid>
    {people
      ? people.map((person, index) => <PersonListItem person={person} key={index} />)
      : 'No Matching People'}
  </TripleGrid>
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
