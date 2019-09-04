import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'
import Link from 'next/link'
/*
  Display any entity that has a name and imgUrl
  Clicks through to the resource + id
  entity {
    name:
    imgUrl
  }
  type = orgaanisation, person, activity
*/

const IdLine = ({ item, path }) =>
  item &&
    <Link href={`/${path}/${item._id}`}>
      <a style={{ display: 'block', margin: '0' }} >
        <Avatar
          size={32}
          shape='square'
          src={item.imgUrl}
          icon='team'
        />
        <span style={{ marginLeft: '1em' }}>{item.name}</span>
      </a>
    </Link>

IdLine.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    imgUrl: PropTypes.string
  }),
  path: PropTypes.string
}

export default IdLine
