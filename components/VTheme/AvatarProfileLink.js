import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { PersonRoleIcons } from '../Person/PersonRole'
import { PersonVerificationBadge } from '../Person/PersonVerification'
export function AvatarProfile ({ person }) {
  if (!person) return null
  return (
    <Link href={`/people/${person._id}`}>
      <a>
        <Avatar
          size='large'
          shape='round'
          onClick={() => Router.push(`/people/${person._id}`)}
          src={person.imgUrl}
          icon={<UserOutlined />}
        />&nbsp;&nbsp;
        <span>{person.nickname}</span>
        {person.role && <PersonRoleIcons roles={person.role} />}
        <PersonVerificationBadge person={person} />
      </a>
    </Link>
  )
}
export default AvatarProfile
