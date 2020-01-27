import { Avatar } from 'antd'
import React from 'react'
import Link from 'next/link'
import Router from 'next/router'

export function AvatarProfile ({ person }) {
  return (
    <Link href={`/people/${person._id}`}>
      <a>
        <Avatar
          size='large'
          shape='square'
          onClick={() => Router.push(`/people/${person._id}`)}
          src={person.imgUrl}
          icon='user'
        />&nbsp;&nbsp;
        {person.nickname}
      </a>
    </Link>
  )
}
export default AvatarProfile
