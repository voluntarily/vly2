import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const headers = {
  person: {
    id: 'ii.person',
    description: "Member item 'Person' header",
    defaultMessage: 'Person'
  },
  organisation: {
    id: 'ii.organisation',
    description: "Member item 'Organisation' header",
    defaultMessage: 'Organisation'
  },
  validation: {
    id: 'ii.validation',
    description: "Member item 'Validation' header",
    defaultMessage: 'Validation'
  },
  status: {
    id: 'ii.status',
    description: "Member item 'Status' header",
    defaultMessage: 'Status'
  }
}

const MemberItem = ({ member, ...props }) => (
  <dl>
    <dt><FormattedMessage {...headers.person} /></dt>
    <dd>{member.person.nickname}</dd>
    <dt><FormattedMessage {...headers.organisation} /></dt>
    <dd>{member.organisation.name}</dd>
    <dt><FormattedMessage {...headers.validation} /></dt>
    <dd>{member.validation}</dd>
    <dt><FormattedMessage {...headers.status} /></dt>
    <dd>{member.status}</dd>
  </dl>
)

MemberItem.propTypes = {
  member: PropTypes.shape({
    person: PropTypes.object.isRequired,
    organisation: PropTypes.string.isRequired,
    validation: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default MemberItem
