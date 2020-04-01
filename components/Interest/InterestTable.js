import { Button, Table } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'
import { InterestAction } from '../../server/api/interest/interest.constants'
import PersonCard from '../Person/PersonCard'
import { AvatarProfile } from '../VTheme/AvatarProfileLink'
import { InterestMessageItem, InterestMessageList } from './InterestMessage'
import { RegisterInterestMessageForm } from './RegisterInterestMessageForm'
import { useIntl, defineMessages, FormattedMessage } from 'react-intl'

export const ExpandedInterestGrid = styled.div`
  display: grid;
  position: relative;
  margin: 0;
  grid-template-columns: 29rem 49rem;
  grid-column-gap: 2rem;
  min-height: 20rem;
 
  height: auto;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: calc(40vw - 4rem) calc(60vw - 4rem);
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
    height: auto;
  }
`
export const ExpandedInterest = ({ interest }) =>
  <ExpandedInterestGrid>
    <PersonCard person={interest.person} />
    <InterestMessageList messages={interest.messages} />
  </ExpandedInterestGrid>

export const MessagesColumn = {
  title: 'Messages',
  key: 'comment',
  render: (text, record) => {
    return (
      <InterestMessageItem message={record.messages.slice(-1)[0]} />
    )
  }
}

const InviteText =
  <FormattedMessage
    id='InterestTable.accept'
    defaultMessage='Accept'
    description='Button allowing owner to invite an interested person'
  />

const DeclineText =
  <FormattedMessage
    id='InterestTable.decline'
    defaultMessage='Decline'
    description='Button allowing owner to decline an interested person'
  />
export const MessageText =
  <FormattedMessage
    id='InterestTable.messagePerson'
    defaultMessage='Message'
    description='Button allowing owner to message an interested person'
  />

const WithdrawText =
  <FormattedMessage
    id='InterestTable.withdrawPersonInvite'
    defaultMessage='Undo'
    description='Button allowing owner to withdraw a invite already issued to an interested person'
  />
const undeclineInviteText =
  <FormattedMessage
    id='InterestTable.undeclineInvite'
    defaultMessage='Accept'
    description='Button allowing owner to "un-decline" a previously declined invite'
  />

const messages = defineMessages({
  accept_title: {
    id: 'InterestTable.accept.title',
    defaultMessage: 'Accept {nickname}',
    description: 'prompt on message form from owner to interested person.'
  },
  accept_prompt: {
    id: 'InterestTable.accept.prompt',
    defaultMessage: 'Optionally add a note to the message we will send to {nickname}',
    description: 'prompt on message form from owner to interested person.'
  },
  decline_title: {
    id: 'InterestTable.decline.title',
    defaultMessage: 'Decline {nickname}',
    description: 'prompt on message form from owner to interested person.'
  },
  decline_prompt: {
    id: 'InterestTable.decline.prompt',
    defaultMessage: 'Optionally add a note to the message we will send to {nickname}',
    description: 'prompt on message form from owner to interested person.'
  },
  message_title: {
    id: 'InterestTable.message.title',
    defaultMessage: 'message {nickname}',
    description: 'prompt on message form from owner to interested person.'
  },
  message_prompt: {
    id: 'InterestTable.message.prompt',
    defaultMessage: 'Send a message to {nickname}',
    description: 'prompt on message form from owner to interested person.'
  }
})

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

  const { formatMessage } = useIntl()

  const formOptions = (action, interest) => {
    if (!interest) return { title: 'interest not set', prompt: '' }
    const nickname = interest.person.nickname

    switch (action) {
      case InterestAction.ACCEPT:
        return {
          title: formatMessage(messages.accept_title, { nickname }),
          prompt: formatMessage(messages.accept_prompt, { nickname })
        }
      case InterestAction.REJECT:
        return {
          title: formatMessage(messages.decline_title, { nickname }),
          prompt: formatMessage(messages.decline_prompt, { nickname })
        }
      case InterestAction.MESSAGE:
        return {
          title: formatMessage(messages.message_title, { nickname }),
          prompt: formatMessage(messages.message_prompt, { nickname })
        }
    }
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
      key: 'name',
      sorter: (a, b) => a.person.nickname.localeCompare(b.person.nickname),
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
      render: (text, record) => {
        return (
          <AvatarProfile person={record.person} />
        )
      }
    },
    MessagesColumn,
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

        return (
          <div>

            {options.acceptButtonEnabled && (
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

            {options.rejectButtonEnabled && (
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
      <RegisterInterestMessageForm
        id='InterestTable.acceptRegisterInterestForm'
        {...formOptions(action, selectedInterest)}
        showTerms={false}
        onSubmit={handleFormSubmit}
        visible={showMessageForm}
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
    acceptButtonEnabled:
      ['interested', 'attended', 'notattended', 'declined'].includes(interest.status),
    rejectButtonEnabled:
      ['invited', 'committed', 'attended', 'notattended'].includes(interest.status)
  }
}

export default InterestTable
