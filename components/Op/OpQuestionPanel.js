/* Dumb React component Shows contents of an opportunity
 */
import React, { useState } from 'react'
import { Comment, Avatar, Form, Button, List, Input } from 'antd'
import moment from 'moment'
const { TextArea } = Input

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType='submit' loading={submitting} onClick={onSubmit} type='primary'>
        Add
      </Button>
    </Form.Item>
  </div>
)

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'questions' : 'question'}`}
    itemLayout='horizontal'
    renderItem={props => <Comment {...props} />}
  />
)

export const OpQuestionPanel = () => {
  const [comments, setComments] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (!value) {
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setComments([
        {
          author: 'Tom',
          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          content: <p>{value}</p>,
          datetime: moment().fromNow()
        },
        ...comments
      ])
      setValue('')
    }, 1000)
  }

  return (
    <>
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        author={<a>Tom</a>}
        avatar={
          <Avatar
            src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
            alt='Tom'
          />
        }
        content={
          <Editor
            onChange={e => { setValue(e.target.value) }}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  )
}

export default OpQuestionPanel
