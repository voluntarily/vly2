/* Display a grid of opanisation cards from an [op]
 */
import { Avatar, Button, Checkbox, Popconfirm, Table } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

class InterestTable extends Component {
  state = {
    filteredInfo: {},
    sortedInfo: {},
  }

  handleInviteButtonClicked (interest) {
    this.props.onInvite(interest)
  }

  handleDeclineButtonClicked (interest) {
    this.props.onDecline(interest)
  }

  handleWithdrawInviteButtonClicked (interest) {
    this.props.onWithdrawInvite(interest)
  }

  onChange = (pagination, filters, sorter)=> {
    console.log('params', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  render () {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: 'Selected',
        key: 'isSelected',
        render: (text, record) => {
          return <Checkbox value='selected' />
        }
      },
      { title: 'Name',
        key: 'imgUrl',
        sorter: (a, b) => a.person.nickname.length - b.person.nickname.length,
        sortOrder: sortedInfo.columnKey === 'imgUrl' && sortedInfo.order,
        render: (text, record) => {
          return (
            <span>
              <Avatar
                size='large'
                shape='square'
                onClick={() => Router.push(`/people/${record.person._id}`)}
                src={record.person.imgUrl}
                icon='user'
              />&nbsp;&nbsp;
              {record.person.nickname}
            </span>
          )
        }
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        key: 'comment'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.length - b.status.length,
        sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
        filters: [
          { text: 'interested', value: 'interested' },
          { text: 'invited', value: 'invited' },
          { text: 'committed', value: 'committed' },
          { text: 'declined', value: 'declined' },
          { text: 'completed', value: 'completed' },
          { text: 'cancelled', value: 'cancelled' },
        ],  
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status.includes(value),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          const options = getEnabledButtons(record)
          let withdrawInviteText = <FormattedMessage id='withdrawVolunteerInvite' defaultMessage='Withdraw Invite' description='Button allowing event organizer to withdraw a invite already issued to an interested volunteer' />
  
          // Needed? Or is declining the end of the road?
          if (options.withdrawInviteButtonEnabled && !options.declineButtonEnabled && !options.inviteButtonEnabled) {
            withdrawInviteText = <FormattedMessage id='undeclineInvite' defaultMessage='Undecline Invite' description='Button allowing event organizer to "un-decline" a previously declined invite' />
          }
  
          return (
            <div>
              {options.inviteButtonEnabled ? <span>
                <Button type='primary' shape='round' onClick={this.handleInviteButtonClicked.bind(this, record)}>
                  <FormattedMessage id='inviteVolunteer' defaultMessage='Invite' description='Button allowing event organizer to invite an interested volunteer' />
                </Button>
                &nbsp;
              </span> : null}
              {options.withdrawInviteButtonEnabled ? <span>
                <Button type='secondary' shape='round' onClick={this.handleWithdrawInviteButtonClicked.bind(this, record)}>
                  {withdrawInviteText}
                </Button>
                &nbsp;
              </span> : null}
              {options.declineButtonEnabled ? <span>
                <Popconfirm id='declineInvitePopConfirm' title='Are you sure?' onConfirm={this.handleDeclineButtonClicked.bind(this, record)} okText='Yes' cancelText='No'>
                  <Button type='danger' shape='round'>
                    <FormattedMessage id='declineVolunteer' defaultMessage='Decline' description='Button allowing event organizer to decline an interested volunteer' />
                  </Button>
                </Popconfirm>
              </span> : null}
            </div>
          )
        }
      }
    ]
    return (
      <Table
        columns={columns}
        dataSource={this.props.interests}
        rowKey='_id'
        pagination={false}
        onChange={this.onChange}
      />
    )
  }
}

InterestTable.propTypes = {
  onInvite: PropTypes.func.isRequired,
  onWithdrawInvite: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  interests: PropTypes.array
}

function getEnabledButtons (interest) {
  return {
    inviteButtonEnabled: interest.status === 'interested',
    declineButtonEnabled: interest.status !== 'completed' && interest.status !== 'cancelled' && interest.status !== 'declined',
    withdrawInviteButtonEnabled: interest.status !== 'completed' && interest.status !== 'cancelled' && interest.status !== 'interested'
  }
}

export default InterestTable
