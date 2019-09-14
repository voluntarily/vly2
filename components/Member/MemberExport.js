import React from 'react'
import { Button } from 'antd/lib/radio'

const exportMembers = (members) => {
  const csv = members.map(member => (`${member.person.name}`))
  return csv
}

const MemberExport = (props) => {
  const members = props.members 

  return (
    <Button onClick={() => { exportMembers(members) } }>Export Members</Button>
  )
}

export default MemberExport
