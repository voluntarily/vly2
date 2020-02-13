import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { FormGrid, InputContainer } from '../VTheme/FormStyles'
import { FormattedMessage } from 'react-intl'

export const newStory = {
  name: '',
  body: ''
}
const { TextArea } = Input

export const StoryForm = ({ story, onSubmit }) => {
  const [storyed, setStoryed] = useState(story)
  const storyName = (
    <FormattedMessage
      id='storyName'
      defaultMessage='Title'
      description='Story name label in StoryDetail Form'
    />
  )
  const storyDescription = (
    <FormattedMessage
      id='storyDescription'
      defaultMessage='Description'
      description='Story description label in StoryDetail Form'
    />
  )

  return (
    <Form>
      <FormGrid>
        <InputContainer>
          <Form.Item label={storyName}>
            <input value={storyed.name} onChange={(e) => setStoryed({ name: e.target.value, body: storyed.body })} />
          </Form.Item>
          <Form.Item label={storyDescription}>
            <TextArea cols='35' value={storyed.body} onChange={(e) => setStoryed({ name: storyed.name, body: e.target.value })} />
          </Form.Item>
          <Button type='primary' onClick={() => onSubmit(storyed)}>Save</Button>
        </InputContainer>
      </FormGrid>
    </Form>)
}
