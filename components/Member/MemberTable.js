/* display a table of members for an organisation
 */
import { Avatar, Button, Checkbox, Table } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { MemberStatus } from '../../server/api/member/member.constants'

class MemberTable extends Component {
  columns = [
    {
      title: 'Selected',
      key: 'isSelected',
      render: (text, record) => {
        return <Checkbox value='selected' />
      }
    },
    { title: 'Name',
      key: 'avatar',
      render: (text, record) => {
        return (
          <span>
            <Avatar
              size='large'
              shape='square'
              onClick={() => Router.push(`/people/${record.person._id}`)}
              src={record.person.avatar}
              icon='user'
            />&nbsp;&nbsp;
            {record.person.nickname}
          </span>
        )
      }
    },
    {
      title: 'Validation',
      dataIndex: 'validation',
      key: 'validation'
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
        const options = buttonStates(record)
        return (
          <div>
            {options.map(btn => {
              return (
                btn.buttonEnabled &&
                <span key={btn.action}>
                  <Button type='primary' shape='round' onClick={this.handleMembershipChange.bind(this, record, btn.action)}>
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

  handleMembershipChange (member, change) {
    this.props.onMembershipChange(member, change)
  }

  render () {
    return (
      <Table
        columns={this.columns}
        dataSource={this.props.members}
        rowKey='_id'
        pagination={false}
      />
    )
  }
}

MemberTable.propTypes = {
  onMembershipChange: PropTypes.func.isRequired,
  members: PropTypes.array
}

/* Button State options
  FOLLOWER: OrgAdmin can invite to be a member
  JOINER:   OrgAdmin can confirm or reject membership
  MEMBER:   OrgAdmin can make an ExMember
  EXMEMBER: OrgAdmin can confirm or reject membership
*/
const buttonStates = member => {
  return [
    {
      buttonEnabled: (member.status === MemberStatus.FOLLOWER) || (member.status === MemberStatus.JOINER) || (member.status === MemberStatus.EXMEMBER),
      label: <FormattedMessage id='member.add' defaultMessage='Add' description='Button allowing orgAdmin to Add a new org member' />,
      action: 'add'
    },
    {
      buttonEnabled: member.status === MemberStatus.JOINER,
      label: <FormattedMessage id='member.reject' defaultMessage='Reject' description='Button allowing orgAdmin to Reject a member application' />,
      action: 'reject'
    },
    {
      buttonEnabled: member.status === MemberStatus.MEMBER,
      label: <FormattedMessage id='member.remove' defaultMessage='Remove' description='Button allowing orgAdmin to Remove an org member' />,
      action: 'remove'
    }
  ]
}

export default MemberTable
