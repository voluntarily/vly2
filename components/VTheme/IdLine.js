import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
/*
  Display any entity that has a name and imgUrl
  Clicks through to the resource + id
  entity {
    name:
    imgUrl
  }
  type = orgaanisation, person, activity
*/
const IDGrid = styled.a`
display: grid;
grid-template-columns: 1.5rem 1fr;
height: 3rem;
`

const IDItems = styled.p`
margin-left: 1rem;
display: inline;

`

const IdLine = ({ item, path }) =>
  item
    ? <Link href={`/${path}/${item._id}`}>
      <a style={{ display: 'block', margin: '0' }} >
        <IDGrid>
          <Avatar
            style={{ marginTop: '0.5rem' }}
            size={32}
            shape='square'
            src={item.imgUrl}
            icon='team'
          />
          <IDItems>
            {item.name}<br />
        Legitimate Organization
          </IDItems>
        </IDGrid>
      </a>
    </Link>
    : null

IdLine.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    imgUrl: PropTypes.string
  }),
  path: PropTypes.string
}

export default IdLine
