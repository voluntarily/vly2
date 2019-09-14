import React from 'react'
import { Button } from 'antd/lib/radio'

const exportMembers = (members) => {
  const membersCsv = 'data:text/csv;charset=utf-8,' + members.map(member => (`${member.person.name}`))
  triggerDownload(membersCsv)
}

const triggerDownload = (data) => {
  let link = document.createElement('a')
  link.setAttribute('href', data)
  link.setAttribute('download', 'members.csv')
  link.click()
}

const MemberExport = ({ members }) => {
  return (
    <Button onClick={() => { exportMembers(members) } }>Export Members</Button>
  )
}

export default MemberExport
