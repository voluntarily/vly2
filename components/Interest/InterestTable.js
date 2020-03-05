import { Button, Table } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { InterestAction } from '../../server/api/interest/interest.constants'
import PersonCard from '../Person/PersonCard'
import { AvatarProfile } from '../VTheme/AvatarProfileLink'
import { InterestMessageItem, InterestMessageList } from './InterestMessage'
import { RegisterInterestMessageForm } from './RegisterInterestMessageForm'

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

const InviteText =
  <FormattedMessage
    id='inviteVolunteer'
    defaultMessage='Invite'
    description='Button allowing event organizer to invite an interested volunteer'
  />

const DeclineText =
  <FormattedMessage
    id='declineVolunteer'
    defaultMessage='Decline'
    description='Button allowing event organizer to decline an interested volunteer'
  />
const MessageText =
  <FormattedMessage
    id='messageVolunteer'
    defaultMessage='Message'
    description='Button allowing event organizer to message an interested volunteer'
  />

const WithdrawText =
  <FormattedMessage
    id='withdrawVolunteerInvite'
    defaultMessage='Withdraw Invite'
    description='Button allowing event organizer to withdraw a invite already issued to an interested volunteer'
  />
const undeclineInviteText =
  <FormattedMessage
    id='undeclineInvite'
    defaultMessage='Undecline Invite'
    description='Button allowing event organizer to "un-decline" a previously declined invite'
  />
const formOptions = {
  [InterestAction.ACCEPT]: {
    title: 'Invite Volunteers',
    prompt: 'Optionally add a note to the message we will send to the volunteer'
  },
  [InterestAction.REJECT]: {
    title: 'Decline Volunteers',
    prompt: 'Optionally add a note to the message we will send to the volunteer'
  },
  [InterestAction.WITHDRAW]: {
    title: 'Withdraw Invite Volunteers',
    prompt: 'Optionally add a note to the message we will send to the volunteer'
  },
  [InterestAction.MESSAGE]: {
    title: 'Message Volunteers',
    prompt: 'Send a message to the volunteer'
  }
}

const InterestTable = ({ interests, onAction }) => {
  const [filteredInfo, setFilteredInfo] = useState({})
  const [sortedInfo, setSortedInfo] = useState({})
  // Batch const [selectedRows, setSelectedRows] = useState([])
  const [selectedInterest, setSelectedInterest] = useState()
  const [action, setAction] = useState()
  const [showMessageForm, setShowMessageForm] = useState(false)

  const handleFormSubmit = (ok, message) => {
    setShowMessageForm(false)
    if (!ok) return
    onAction(selectedInterest, action, message)
  }

  const handleClick = (action) => (interest) => {
    setAction(action)
    setSelectedInterest(interest)
    setShowMessageForm(true)
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter)
  }

  // TODO fix batch updates.
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectedRows(selectedRows)
  //   }
  // }
  const columns = [
    {
      title: 'Name',
      key: 'person',
      sorter: (a, b) => a.person.nickname.localeCompare(b.person.nickname),
      sortOrder: sortedInfo.columnKey === 'person' && sortedInfo.order,
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
        let withdrawInviteText = WithdrawText

        // Needed? Or is declining the end of the road?
        if (
          options.withdrawInviteButtonEnabled &&
          !options.declineButtonEnabled &&
          !options.inviteButtonEnabled
        ) {
          withdrawInviteText = undeclineInviteText
        }

        return (
          <div>

            {options.inviteButtonEnabled && (
              <span>
                <Button
                  type='primary' shape='round'
                  onClick={() => handleClick(InterestAction.ACCEPT)(record)}
                >
                  {InviteText}
                </Button>
                  &nbsp;
              </span>
            )}
            {options.withdrawInviteButtonEnabled && (
              <span>
                <Button
                  type='secondary' shape='round'
                  onClick={() => handleClick(InterestAction.WITHDRAW)(record)}
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
                  onClick={() => handleClick(InterestAction.REJECT)(record)}
                >
                  {DeclineText}
                </Button>
              </span>
            )}
            <span>
              <Button
                shape='round'
                onClick={() => handleClick(InterestAction.MESSAGE)(record)}
              >
                {MessageText}
              </Button>
            </span>
            <RegisterInterestMessageForm
              id='acceptRegisterInterestForm'
              {...formOptions[action]}
              showTerms={false}
              onSubmit={handleFormSubmit}
              visible={showMessageForm}
            />
          </div>
        )
      }
    }
  ]

  // TODO BATCH
  // // put all selected rows' status together to form a selectedStatus array
  // const selectedStatus = selectedRows.map(row => row.status)
  // const menu = (
  //   <Menu>
  //     {selectedStatus.every(status => status === 'interested') && (
  //       <Menu.Item>
  //         <a onClick={() => handleClick(InterestAction.ACCEPT)(selectedRows)}>
  //           {InviteText}
  //         </a>
  //       </Menu.Item>
  //     )}
  //     {selectedStatus.every(status => status === 'invited') && (
  //       <Menu.Item>
  //         <a onClick={() => handleClick(InterestAction.WITHDRAW)(selectedRows)}>
  //           {WithdrawText}
  //         </a>
  //       </Menu.Item>
  //     )}
  //     {!selectedStatus.includes('declined') && (
  //       <Menu.Item>
  //         <a onClick={() => handleClick(InterestAction.REJECT)(selectedRows)}>
  //           {DeclineText}
  //         </a>
  //       </Menu.Item>
  //     )}
  //     <Menu.Item>
  //       <a onClick={() => handleClick(InterestAction.MESSAGE)(selectedRows)}>
  //         {MessageText}
  //       </a>
  //     </Menu.Item>
  //   </Menu>
  // )
  return (
    <>
      {/* <Dropdown overlay={menu}>
        <a className='ant-dropdown-link'>
            Group Actions <Icon type='down' />
        </a>
      </Dropdown> */}
      <Table
        columns={columns}
        dataSource={interests.filter((interest) => interest.person !== null)}
        rowKey='_id'
        pagination={false}
        onChange={handleTableChange}
        expandedRowRender={record => <ExpandedInterest interest={record} />}
        expandRowByClick
        // rowSelection={rowSelection}
      />
    </>
  )
}

InterestTable.propTypes = {
  onAction: PropTypes.func.isRequired,
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
