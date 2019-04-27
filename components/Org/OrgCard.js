import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Card } from 'antd'

const OrgCard = ({ org, ...props }) => (
  <Link href={`/orgs/${org._id}`} >
    <Card
      cover={<img src={org.imgUrl} alt={org.title} />}
      {...props}
    >
      <Card.Meta
        title={<h1>{org.name}</h1>}
        description={<p>{org.about}<br /><small>{org.type}</small></p>}
      />
    </Card>
  </Link>
)

OrgCard.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired
  }).isRequired
}

export default OrgCard
