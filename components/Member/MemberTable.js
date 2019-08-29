/* display a table of members for an organisation
 */
import { Avatar, Button, Table } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { MemberStatus } from '../../server/api/member/member.constants'

class MemberTable extends Component {
  columns = [
    // {
    //   title: '',
    //   key: 'isSelected',
    //   render: (text, record) => {
    //     return <Checkbox value='selected' />
    //   }
    // },
    { title: 'Name',
      key: 'imgUrl',
      // sorter: (a, b, sortOrder) => sortOrder === 'ascend' ? ('' + a.name).localeCompare(b.name) : ('' + b.name).localeCompare(a.name),
      // sortDirections: ['ascend', 'descend'],
      // defaultSortOrder: 'ascend',
      render: (text, record) => {
        return (
          <span>
            <Avatar
              style={{ marginRight: '1rem' }}
              size='large'
              shape='square'
              onClick={() => Router.push(`/people/${record.person._id}`)}
              src={record.person.imgUrl}
              icon='user'
            />
            {record.person.nickname}
          </span>
        )
      }
    },
    // {
    //   title: 'Validation',
    //   dataIndex: 'validation',
    //   key: 'validation'
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
      // sorter: (a, b, sortOrder) => {
      //   console.log(a, b, sortOrder)
      //   const order = (sortOrder === 'ascend') ? ('' + a.status).localeCompare(b.status) : ('' + b.status).localeCompare(a.status)
      //   console.log(order)
      //   return order
      // },
      // sortDirections: ['ascend', 'descend'],
      // defaultSortOrder: 'ascend'
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
        expandedRowRender={record => <p style={{ margin: 0 }}>{record.person.name} &lt;{record.person.email}&gt; {record.validation} </p>}
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
  MEMBER:   OrgAdmin can make an ExMember, or an admin
  EXMEMBER: OrgAdmin can confirm or reject membership
  ORGADMIN: OrgAdmin can make normal member again
*/
const buttonStates = member => {
  return [
    {
      buttonEnabled: [MemberStatus.FOLLOWER, MemberStatus.JOINER, MemberStatus.VALIDATOR, MemberStatus.EXMEMBER].includes(member.status),
      label: <FormattedMessage id='member.add' defaultMessage='Add' description='Button allowing orgAdmin to Add a new org member' />,
      action: 'add'
    },
    {
      buttonEnabled: [MemberStatus.JOINER, MemberStatus.VALIDATOR].includes(member.status),
      label: <FormattedMessage id='member.reject' defaultMessage='Reject' description='Button allowing orgAdmin to Reject a member application' />,
      action: 'reject'
    },
    {
      buttonEnabled: member.status === MemberStatus.MEMBER,
      label: <FormattedMessage id='member.remove' defaultMessage='Remove' description='Button allowing orgAdmin to Remove an org member' />,
      action: 'remove'
    },
    {
      buttonEnabled: member.status === MemberStatus.MEMBER,
      label: <FormattedMessage id='member.makeadmin' defaultMessage='Make Admin' description='Button allowing orgAdmin to add new orgadmin' />,
      action: 'makeadmin'
    },
    {
      buttonEnabled: (member.status === MemberStatus.ORGADMIN) && !member.isMe,
      label: <FormattedMessage id='member.unadmin' defaultMessage='Cancel Admin' description='Button allowing orgAdmin to return an admin back to normal member' />,
      action: 'add'
    }
  ]
}

export default MemberTable
