import React from 'react'
import Button from 'antd/lib/button'
import { Spacer } from '../VTheme/VTheme'
import { FormattedMessage } from 'react-intl'

export const createCsv = (members) => {
  let membersCsv = 'data:text/csv;charset=utf-8,'
  membersCsv += 'Name,Email,Phone,Role,Date_Added\n'
  if (members) {
    membersCsv += members.map(member => (
      `${member.person.name},${member.person.email},${member.person.phone},${member.status},${member.dateAdded}`
    )).join('\n')
  }
  return membersCsv
}

const exportMembers = (members) => {
  const csv = createCsv(members)
  triggerDownload(csv)
}

const triggerDownload = (data) => {
  let link = document.createElement('a')
  link.setAttribute('href', data)
  link.setAttribute('download', 'members.csv')
  link.click()
}

const MemberExport = ({ members }) => {
  return (
    <>
      <Button shape='round' onClick={() => { exportMembers(members) }}>
        <FormattedMessage
          id='member.exportCsv'
          defaultMessage='Export Members (Default Message)'
          description='Use the local equivalent of export members.'
        />
      </Button>
      <Spacer />
    </>
  )
}

export default MemberExport
