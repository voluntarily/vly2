import React from 'react'
import PropTypes from 'prop-types'

const InterestItem = ({ interest, ...props }) => (
  <dl>
    <dt>Person</dt>
    <dd>{interest.person.nickname}</dd>
    <dt>Opportunity</dt>
    <dd>{interest.opportunity}</dd>
    <dt>Comment</dt>
    <dd>{interest.comment}</dd>
    <dt>Status</dt>
    <dd>{interest.status}</dd>
  </dl>
)

InterestItem.propTypes = {
  interest: PropTypes.shape({
    person: PropTypes.object.isRequired,
    opportunity: PropTypes.string.isRequired,
    comment: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default InterestItem
