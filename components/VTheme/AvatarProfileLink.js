import { Avatar } from 'antd'
import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { PersonRoleIcons } from '../Person/PersonRole'
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
          icon='user'
        />&nbsp;&nbsp;
        <span>{person.nickname}</span>
        <PersonRoleIcons roles={person.role} />
      </a>
    </Link>
  )
}
export default AvatarProfile
