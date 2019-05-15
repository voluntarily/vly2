import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
// import Markdown from 'markdown-to-jsx'
// import OrgType from './OrgType'
import AwesomeCard from '../../components/TestContainer/AwesomeCard/AwesomeCard'

const OrgCard = ({ org, ...props }) => (
  <Link href={`/orgs/`}>
    <AwesomeCard />
  </Link>
)

OrgCard.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.arrayOf(
      PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])
    ).isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default OrgCard
