import { SolutionOutlined, TeamOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { MemberStatus } from '../../server/api/member/member.constants'

/*
  Display a list of organisations that a person is following or a member of
  expects organisation to be populated
  expects members list to be filtered by status - Follower or Member
*/
const OrgLi = ({ org, status }) =>
  <Link href={`/orgs/${org._id}`}>
    <a>
      <li>
        <Avatar
          size='small'
          shape='square'
          src={org.imgUrl}
          icon={<TeamOutlined />}
        />&nbsp;&nbsp;
        {org.name}&nbsp;
        {status === MemberStatus.ORGADMIN && <SolutionOutlined />}
      </li>
    </a>
  </Link>

const UnbulletedUl = styled.ul`
  list-style: none;
  padding-left: 0;

  li {
    padding-bottom: 0.5rem;
  }
`
const MemberUl = ({ members }) =>
  <UnbulletedUl>
    {members.map((member, index) => <OrgLi key={index} org={member.organisation} status={member.status} />)}
  </UnbulletedUl>

MemberUl.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    organisation: PropTypes.object.isRequired,
    _id: PropTypes.string.isRequired
  })).isRequired
}

export default MemberUl
