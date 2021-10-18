/* display a table of members for an organisation
 */
import { Button, Table } from 'antd'
import { useIntl } from 'react-intl'
import { MemberStatus } from '../../server/api/member/member.constants'
import { AvatarProfile } from '../VTheme/AvatarProfileLink'

const buttonStates = (member, meid, formatMessage) => {
  return [
    {
      buttonEnabled: [MemberStatus.FOLLOWER, MemberStatus.JOINER, MemberStatus.VALIDATOR, MemberStatus.EXMEMBER].includes(member.status),
      label: formatMessage({ id: 'member.add', defaultMessage: 'Add', description: 'Button allowing orgAdmin to Add a new org member' }),
      action: 'add'
    },
    {
      buttonEnabled: [MemberStatus.JOINER, MemberStatus.VALIDATOR].includes(member.status),
      label: formatMessage({ id: 'member.reject', defaultMessage: 'Reject', description: 'Button allowing orgAdmin to Reject a member application' }),
      action: 'reject'
    },
    {
      buttonEnabled: member.status === MemberStatus.MEMBER,
      label: formatMessage({ id: 'member.remove', defaultMessage: 'Remove', description: 'Button allowing orgAdmin to Remove an org member' }),
      action: 'remove'
    },
    {
      buttonEnabled: member.status === MemberStatus.MEMBER,
      label: formatMessage({ id: 'member.makeadmin', defaultMessage: 'Make Admin', description: 'Button allowing orgAdmin to add new orgadmin' }),
      action: 'makeadmin'
    },
    {
      buttonEnabled: (member.status === MemberStatus.ORGADMIN) && (member.person && member.person._id !== meid),
      label: formatMessage({ id: 'member.unadmin', defaultMessage: 'Cancel Admin', description: 'Button allowing orgAdmin to return an admin back to normal member' }),
      action: 'add'
    }
  ]
}

const MemberTable = ({ onMembershipChange, meid, members }) => {
  const { formatMessage } = useIntl()

  const columns = [
    {
      title: 'Name',
      key: 'imgUrl',
      render: (text, record) => {
        return (
          <AvatarProfile person={record.person} />
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        const options = buttonStates(record, meid, formatMessage)
        return (
          <div>
            {options.map(btn => {
              return (
                btn.buttonEnabled &&
                  <span key={btn.action}>
                    <Button type='primary' shape='round' onClick={() => handleMembershipChange(record, btn.action)}>
                      {btn.label}
                    </Button>
                  &nbsp;
                  </span>
              )
            })}
          </div>
        )
      }
    }
  ]

  const handleMembershipChange = (member, change) => {
    onMembershipChange(member, change)
  }

  return (
    <Table
      columns={columns}
      dataSource={members}
      rowKey='_id'
      expandedRowRender={record => <p style={{ margin: 0 }}>{record.person.name} &lt;{record.person.email}&gt; {record.validation} </p>}
    />
  )
}

/* Button State options
  FOLLOWER: OrgAdmin can invite to be a member
  JOINER:   OrgAdmin can confirm or reject membership
  MEMBER:   OrgAdmin can make an ExMember, or an admin
  EXMEMBER: OrgAdmin can confirm or reject membership
  ORGADMIN: OrgAdmin can make normal member again
*/

export default MemberTable
