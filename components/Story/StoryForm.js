import React, { useState } from 'react'
import { Button, Form } from 'antd'
import { FormGrid, InputContainer } from '../VTheme/FormStyles'
export const newStory = {
  title: '',
  body: ''
}

export const StoryForm = ({ story, onSubmit }) => {
  const [storyed, setStoryed] = useState(story)

  return (
    <Form>
      <FormGrid>
        <InputContainer>
          <Form.Item label='Title'>
            <input value={storyed.title} onChange={(e) => setStoryed({ title: e.target.value, body: storyed.body })} />
          </Form.Item>
          <Form.Item label='Description'>
            <textarea cols='35' value={storyed.body} onChange={(e) => setStoryed({ title: storyed.title, body: e.target.value })} />
          </Form.Item>
          <Button type='primary' onClick={() => onSubmit(storyed)}>Save</Button>
        </InputContainer>
      </FormGrid>
    </Form>)
}

export const CreateStory = ({ stories }) => {
  const [storyList, setStoryList] = useState(stories)

  const handleSave = (story) => {
    setStoryList([story, ...storyList])
  }
  return (
    <>
      <StoryForm story={newStory} onSubmit={handleSave} />
    </>
  )
}
