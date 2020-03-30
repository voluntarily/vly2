import React from 'react'
import { Comment, List, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'
/* Show a latest message from an interest
var messageSchema = new mongoose.Schema({
  body: String,
  // who sent the message (op or vp?)
  author: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
  createdAt: { type: Date, default: Date.now, required: true }
})
 */
export const InterestMessageItem = ({ message }) => (
  message ? (
    <Comment
    // actions={actions}
      author={message.author.nickname}
      content={
        <p>
          {message.body}
        </p>
      }
      datetime={
        <Tooltip title={moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment(message.createdAt).fromNow()}</span>
        </Tooltip>
      }
    />)
    : null
)
InterestMessageItem.propTypes = {
  message: PropTypes.shape({
    body: PropTypes.string.isRequired,
    author: PropTypes.object.isRequired
  }).isRequired
}

export const InterestMessageList = ({ messages }) => {
  if (messages.length === 0) return null
  const latestFirst = messages.sort(
    (a, b) => {
      return moment(b.createdAt) - moment(a.createdAt)
    }
  )
  const data = latestFirst.map(message => ({
    // actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: message.author.nickname,
    // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: <p>{message.body}</p>,
    datetime: (
      <Tooltip title={moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment(message.createdAt).fromNow()}</span>
      </Tooltip>)
  }))

  return (
    <List
      size='small'
      style={{ overflow: 'auto' }}
      className='comment-list'
      // header={`${data.length} messages`}
      itemLayout='horizontal'
      dataSource={data}
      renderItem={item => (
        <li>
          <Comment
            // actions={item.actions}
            author={item.author}
            // avatar={item.avatar}
            content={item.content}
            datetime={item.datetime}
          />
        </li>
      )}
    />
  )
}

InterestMessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      author: PropTypes.object.isRequired
    }).isRequired
  )
}
