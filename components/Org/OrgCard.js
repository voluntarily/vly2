import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import OrgRole from './OrgRole'
import { Card } from '../VTheme/VTheme'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

const OrgCard = ({ org }) => (
  <Card>
    <Link href={`/orgs/${org._id}`}>
      <a>
        <img src={org.imgUrl} />
        <figcaption>
          <h1>{org.name}</h1>
          <OrgRole orgRole={org.role} />
        </figcaption>
      </a>
    </Link>
  </Card>
)

OrgCard.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    role: PropTypes.arrayOf(
      PropTypes.oneOf([OrganisationRole.ADMIN, OrganisationRole.OPPORTUNITY_PROVIDER, OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER, 'other'])
    ).isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default OrgCard
