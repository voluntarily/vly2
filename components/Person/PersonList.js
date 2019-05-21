/* Display a grid of People cards from an [person]
 */
import React from 'react'
import PropTypes from 'prop-types'
import PersonCard from './PersonCard'
import { Col, Row } from 'antd'

const PersonList = ({ people, ...props }) => (
  <Row type='flex' align='top' gutter={{ xs: 8, sm: 16, md: 24 }} >
    {
      // TODO why people.data here but not orgs.data elsewhere?
      (people && people.data ? people.data.map((person, index) => (
        <Col xs={24} sm={12} md={8} lg={6} xxl={4} key={index} >
          <PersonCard
            person={person}
            key={index}
          />
        </Col>
      )) : 'No Matching People')
    }
  </Row>
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
