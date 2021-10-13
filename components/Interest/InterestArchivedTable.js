import { Button, Table } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { InterestAction } from '../../server/api/interest/interest.constants'
import { AvatarProfile } from '../VTheme/AvatarProfileLink'
import { ExpandedInterest, MessagesColumn, MessageText } from './InterestTable'
import { RegisterInterestMessageForm } from './RegisterInterestMessageForm'

const AttendedText = (
  <FormattedMessage
    id='markPresent' defaultMessage='Attended'
    description='Button allowing event organizer to mark the volunteer as attended'
  />
)

const NotAttendedText = (
  <FormattedMessage
    id='markAbsent' defaultMessage='Not Attended'
    description='Button allowing event organizer to mark the volunteer as not attended'
  />
)

const formOptions = {
  [InterestAction.ACCEPT]: {
    title: 'Thank Volunteers',
    prompt: 'Send a note of thanks to the volunteer for attending'
  },
  [InterestAction.REJECT]: {
    title: 'Thank Interested Volunteers',
    prompt: 'Send a note thanking those that were interested but could not be there.'
  },
  [InterestAction.MESSAGE]: {
    title: 'Message Volunteers',
    prompt: 'Send a message to the volunteer'
  }
}
const InterestArchivedTable = ({ interests, onAction }) => {
  const [filteredInfo, setFilteredInfo] = useState({})
  const [sortedInfo, setSortedInfo] = useState({})
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

  const columns = [
    {
      title: 'Name',
      key: 'name',
      sorter: (a, b) => a.person.nickname.length - b.person.nickname.length,
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
        { text: 'attended', value: 'attended' },
        { text: 'not attended', value: 'not attended' },
        { text: 'interested', value: 'interested' },
        { text: 'invited', value: 'invited' },
        { text: 'committed', value: 'committed' },
        { text: 'declined', value: 'declined' },
        { text: 'completed', value: 'completed' },
        { text: 'cancelled', value: 'cancelled' }
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
            {options.attendedButtonEnabled &&
              <span>
                <Button
                  type='primary' shape='round'
                  onClick={() => handleClick(InterestAction.ACCEPT)(record)}
                >
                  {AttendedText}
                </Button>
                &nbsp;
              </span>}
            {options.notAttendedButtonEnabled &&
              <span>
                <Button
                  type='danger' shape='round'
                  onClick={() => handleClick(InterestAction.REJECT)(record)}
                >
                  {NotAttendedText}
                </Button>
              </span>}
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
  return (
    <>
      <Table
        columns={columns}
        dataSource={interests}
        rowKey='_id'
        pagination={false}
        onChange={handleTableChange}
        expandedRowRender={record => <ExpandedInterest interest={record} />}
        expandRowByClick
      />
      <RegisterInterestMessageForm
        id='acceptRegisterInterestForm'
        {...formOptions[action]}
        showTerms={false}
        onSubmit={handleFormSubmit}
        visible={showMessageForm}
      />
    </>
  )
}

InterestArchivedTable.propTypes = {
  onAction: PropTypes.func.isRequired,
  interests: PropTypes.array
}

function getEnabledButtons (interest) {
  return {
    attendedButtonEnabled: interest.status !== 'attended',
    notAttendedButtonEnabled: interest.status !== 'not attended'
  }
}

export default InterestArchivedTable
