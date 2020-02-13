import { Button, Table } from 'antd'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { AvatarProfile } from '../VTheme/AvatarProfileLink'

class InterestArchivedTable extends Component {
  state = {
    filteredInfo: {},
    sortedInfo: {}
  }

  handlePresentButtonClicked (interest) {
    this.props.onPresent(interest)
  }

  handleAbsentButtonClicked (interest) {
    this.props.onAbsent(interest)
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }

  render () {
    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    const columns = [
      {
        title: 'Name',
        key: 'name',
        sorter: (a, b) => a.person.nickname.length - b.person.nickname.length,
        sortOrder: sortedInfo.columnKey === 'imgUrl' && sortedInfo.order,
        render: (text, record) => {
          return (
            <AvatarProfile person={record.person} />
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
                  <Button type='danger' shape='round' onClick={this.handlePresentButtonClicked.bind(this, record)}>
                    <FormattedMessage
                      id='markPresent' defaultMessage='Attended'
                      description='Button allowing event organizer to mark the volunteer as attended'
                    />
                  </Button>
                </span>}
              {options.notAttendedButtonEnabled &&
                <span>
                  <Button type='danger' shape='round' onClick={this.handleAbsentButtonClicked.bind(this, record)}>
                    <FormattedMessage
                      id='markAbsent' defaultMessage='Not Attended'
                      description='Button allowing event organizer to mark the volunteer as not attended'
                    />
                  </Button>
                </span>}
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
        onChange={this.handleTableChange}
      />
    )
  }
}

InterestArchivedTable.propTypes = {
  onPresent: PropTypes.func.isRequired,
  onAbsent: PropTypes.func.isRequired,
  interests: PropTypes.array
}

function getEnabledButtons (interest) {
  return {
    attendedButtonEnabled: interest.status !== 'attended',
    notAttendedButtonEnabled: interest.status !== 'not attended'
  }
}

export default InterestArchivedTable
