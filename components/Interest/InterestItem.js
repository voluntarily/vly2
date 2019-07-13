import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl';

const headers = {
  person: {
    id: 'ii.person',
    description: "Interest item 'Person' header",
    defaultMessage: "Person"
  },
  opportunity: {
    id: 'ii.opportunity',
    description: "Interest item 'Opportunity' header",
    defaultMessage: "Opportunity"
  },
  comment: {
    id: 'ii.comment',
    description: "Interest item 'Comment' header",
    defaultMessage: "Comment"
  },
  status: {
    id: 'ii.status',
    description: "Interest item 'Status' header",
    defaultMessage: "Status"
  }
};

const InterestItem = ({ interest, ...props }) => (
  <dl>
    <dt><FormattedMessage {...headers.person}/></dt>
    <dd>{interest.person.nickname}</dd>
    <dt><FormattedMessage {...headers.opportunity}/></dt>
    <dd>{interest.opportunity}</dd>
    <dt><FormattedMessage {...headers.comment}/></dt>
    <dd>{interest.comment}</dd>
    <dt><FormattedMessage {...headers.status}/></dt>
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
