import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'
import styled from 'styled-components'
import Link from 'next/link'

/*
  Display a list of organisations that a person is following or a member of
  expects organisation to be populated
  expects members list to be filtered by status - Follower or Member
*/
const OrgLi = ({ org }) =>
  <Link href={`/orgs/${org._id}`}><a>
    <li>
      <Avatar
        size='small'
        shape='square'
        src={org.imgUrl}
        icon='team'
      />&nbsp;&nbsp;
      {org.name}
    </li>
  </a></Link>

const UnbulletedUl = styled.ul`
  list-style: none;
  padding-left: 0;

  li {
    padding-bottom: 0.5rem;
  }
`
const MemberUl = ({ members }) => {
  return (members
    ? <UnbulletedUl>
      {members.map(member => <OrgLi key={member.organisation._id} org={member.organisation} />)}
    </UnbulletedUl>
    : '')
}
MemberUl.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    organisation: PropTypes.object.isRequired,
    _id: PropTypes.string.isRequired
  })).isRequired
}

export default MemberUl
