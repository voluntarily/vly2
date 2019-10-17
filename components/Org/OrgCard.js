import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import OrgCategory from './OrgCategory'
import { Card } from '../VTheme/VTheme'

const OrgCard = ({ org, ...props }) => (
  <Card>
    <Link href={`/orgs/${org._id}`}>
      <a>
        <img src={org.imgUrl} />
        <figcaption>
          <h1>{org.name}</h1>
          <OrgCategory orgCategory={org.category} />
        </figcaption>
      </a>
    </Link>
  </Card>
)

OrgCard.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    category: PropTypes.arrayOf(
      PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])
    ).isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default OrgCard
