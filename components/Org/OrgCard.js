import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Card } from 'antd'
import Markdown from 'markdown-to-jsx'
import OrgType from './OrgType'

const OrgCard = ({ org, ...props }) => (
  <Link href={`/orgs/${org._id}`} >
    <Card
      cover={<img src={org.imgUrl} alt={org.title} />}
      {...props}
    >
      <Card.Meta
        title={<h1>{org.name}</h1>}
        description={<div><Markdown>{org.about}</Markdown><br /><small>
          <ul>{org.type.map((t, index) => <OrgType key={index} orgType={t} />)}</ul>
        </small></div>}
      />
    </Card>
  </Link>
)

OrgCard.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])).isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default OrgCard
