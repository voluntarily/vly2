import React from 'react'
import Link from 'next/link'
import OrgRole from './OrgRole'
import { Card } from '../VTheme/VTheme'

const OrgCard = ({ org }) => (
  <Card>
    <Link href={`/orgs/${org._id}`}>
      <a>
        <img alt='organisation avatar' src={org.imgUrl} />
        <figcaption>
          <h1>{org.name}</h1>
          <OrgRole orgRole={org.role} />
        </figcaption>
      </a>
    </Link>
  </Card>
)

export default OrgCard
