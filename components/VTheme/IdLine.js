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
const IdLine = ({ item, type }) =>
  <Link href={`/${type}/${item._id}`}><a>
    <Avatar
      size='small'
      shape='square'
      src={item.imgUrl}
      icon='team'
    />&nbsp;&nbsp;
    {item.name}&nbsp;
  </a></Link>

IdLine.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired
}

export default IdLine
