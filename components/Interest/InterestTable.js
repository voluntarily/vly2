/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
// import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Table, Divider, Button } from 'antd'

const columns = [
  { 
    title: 'person ID',
    dataIndex: 'person',
    key: 'person',
  },
  { 
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment'
  },
  { 
    title: 'Status',
    dataIndex: 'status',
    key: 'status'
  },  
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <div>
        <Button type='primary' shape='round' href="javascript:;">Invite </Button>
        <br />
        <Button type='secondary' shape='round' href="javascript:;">Decline</Button>
      </div>
    ),
  }, 
]


const InterestTable = ({ interests, ...props }) => (
  <Table columns={columns} dataSource={interests} pagination={false}/>
)


export default InterestTable
