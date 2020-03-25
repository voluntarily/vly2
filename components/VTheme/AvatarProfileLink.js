import { Avatar } from 'antd'
import React from 'react'
import Link from 'next/link'
import Router from 'next/router'

export function AvatarProfile ({ person }) {
  if (!person) return null
  return (
    <Link href={`/people/${person._id}`}>
      <a>
        <Avatar
          size='large'
          shape='square'
          onClick={() => Router.push(`/people/${person._id}`)}
          src={person.imgUrlsm}
          icon='user'
        />&nbsp;&nbsp;
        <span>{person.nickname}</span>
      </a>
    </Link>
  )
}
export default AvatarProfile
