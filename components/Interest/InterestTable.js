import React, { useState } from 'react'
import { Button, Table, Dropdown, Icon, Menu } from 'antd'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FormattedMessage } from 'react-intl'
import { AvatarProfile } from '../VTheme/AvatarProfileLink'
import { InterestMessageList, InterestMessageItem } from './InterestMessage'
import { PersonCard } from '../Person/PersonCard'
const OneOrMany = (obj, fn) => {
  if (Array.isArray(obj)) {
    obj.map(item => fn(item))
  } else {
    fn(obj)
  }
}

export const ExpandedInterestGrid = styled.div`
  display: grid;
  position: relative;
  margin: 0;
  grid-template-columns: 29rem 49rem;
  grid-column-gap: 2rem;
  height: 20rem;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: calc(40vw - 4rem) calc(60vw - 4rem);
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
    height: auto;
  }
`
const ExpandedInterest = ({ interest }) =>
  <ExpandedInterestGrid>
    <PersonCard person={interest.person} />
    <InterestMessageList messages={interest.messages} />
  </ExpandedInterestGrid>

const InterestTable = ({ interests, onInvite, onDecline, onWithdrawInvite }) => {
  const [filteredInfo, setFilteredInfo] = useState({})
  const [sortedInfo, setSortedInfo] = useState({})
  const [selectedRows, setSelectedRows] = useState([])

  const handleInviteButtonClicked = (interest) => {
    OneOrMany(interest, onInvite)
  }

  const handleDeclineButtonClicked = (interest) => {
    OneOrMany(interest, onDecline)
  }

  const handleWithdrawInviteButtonClicked = (interest) => {
    OneOrMany(interest, onWithdrawInvite)
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter)
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows)
  }
  const columns = [
    {
      title: 'Name',
      key: 'person',
      sorter: (a, b) => a.person.nickname.localeCompare(b.person.nickname),
      sortOrder: sortedInfo.columnKey === 'imgUrl' && sortedInfo.order,
      render: (text, record) => {
        return (
          <AvatarProfile person={record.person} />
        )
      }
    },
    {
      title: 'Messages',
      key: 'comment',
      render: (text, record) => {
        return (
          <InterestMessageItem message={record.messages.slice(-1)[0]} />
        )
      }
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
        { text: 'attended', value: 'attended' },
        { text: 'notattended', value: 'notattended' }
      ],
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value)
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        const options = getEnabledButtons(record)
        let withdrawInviteText = (
          <FormattedMessage
            id='withdrawVolunteerInvite'
            defaultMessage='Withdraw Invite'
            description='Button allowing event organizer to withdraw a invite already issued to an interested volunteer'
          />
        )

        // Needed? Or is declining the end of the road?
        if (
          options.withdrawInviteButtonEnabled &&
          !options.declineButtonEnabled &&
          !options.inviteButtonEnabled
        ) {
          withdrawInviteText = (
            <FormattedMessage
              id='undeclineInvite'
              defaultMessage='Undecline Invite'
              description='Button allowing event organizer to "un-decline" a previously declined invite'
            />
          )
        }

        return (
          <div>
            {options.inviteButtonEnabled && (
              <span>
                <Button
                  type='primary' shape='round'
                  onClick={() => handleInviteButtonClicked(record)}
                >
                  <FormattedMessage
                    id='inviteVolunteer'
                    defaultMessage='Invite'
                    description='Button allowing event organizer to invite an interested volunteer'
                  />
                </Button>
                  &nbsp;
              </span>
            )}
            {options.withdrawInviteButtonEnabled && (
              <span>
                <Button
                  type='secondary' shape='round'
                  onClick={() => handleWithdrawInviteButtonClicked(record)}
                >
                  {withdrawInviteText}
                </Button>
                  &nbsp;
              </span>
            )}
            {options.declineButtonEnabled && (
              <span>
                <Button
                  type='danger' shape='round'
                  onClick={() => handleDeclineButtonClicked(record)}
                >
                  <FormattedMessage
                    id='declineVolunteer'
                    defaultMessage='Decline'
                    description='Button allowing event organizer to decline an interested volunteer'
                  />
                </Button>
              </span>
            )}
          </div>
        )
      }
    }
  ]
  const rowSelection = {
    handleTableChange: onSelectChange
  }

  // put all selected rows' status together to form a selectedStatus array
  const selectedStatus = selectedRows.map(row => row.status)
  const menu = (
    <Menu>
      {selectedStatus.every(status => status === 'interested') && (
        <Menu.Item>
          <a onClick={() => handleInviteButtonClicked(selectedRows)}>
              Invite
          </a>
        </Menu.Item>
      )}
      {selectedStatus.every(status => status === 'invited') && (
        <Menu.Item>
          <a onClick={() => handleWithdrawInviteButtonClicked(selectedRows)}>
              Withdraw Invite
          </a>
        </Menu.Item>
      )}
      {!selectedStatus.includes('declined') && (
        <Menu.Item>
          <a onClick={() => handleDeclineButtonClicked(selectedRows)}>
              Decline
          </a>
        </Menu.Item>
      )}
    </Menu>
  )
  return (
    <>
      <Dropdown overlay={menu}>
        <a className='ant-dropdown-link'>
            Group Actions <Icon type='down' />
        </a>
      </Dropdown>
      <Table
        columns={columns}
        dataSource={interests.filter((interest) => interest.person !== null)}
        rowKey='_id'
        pagination={false}
        onChange={handleTableChange}
        expandedRowRender={record => <ExpandedInterest interest={record} />}
        expandRowByClick
        rowSelection={rowSelection}
      />
    </>
  )
}

InterestTable.propTypes = {
  onInvite: PropTypes.func.isRequired,
  onWithdrawInvite: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  interests: PropTypes.array.isRequired
}

function getEnabledButtons (interest) {
  return {
    inviteButtonEnabled: interest.status === 'interested',
    declineButtonEnabled:
      interest.status !== 'attended' &&
      interest.status !== 'notattended' &&
      interest.status !== 'declined',
    withdrawInviteButtonEnabled:
      interest.status !== 'attended' &&
      interest.status !== 'notattended' &&
      interest.status !== 'interested'
  }
}

export default InterestTable

/* expandable={{
          expandedRowRender: record =>
            <InterestMessageList style={{ margin: '6rem' }} messages={record.messages} />,
          rowExpandable: true // record => record.messages.length > 1
        }}
        */ // r
