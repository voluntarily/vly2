import React, { useState } from 'react'
import { Button, Form } from 'antd'
import { FormGrid, InputContainer } from '../VTheme/FormStyles'
export const newStory = {
  name: '',
  body: ''
}

export const StoryForm = ({ story, onSubmit }) => {
  const [storyed, setStoryed] = useState(story)

  return (
    <Form>
      <FormGrid>
        <InputContainer>
          <Form.Item label='Title'>
            <input value={storyed.name} onChange={(e) => setStoryed({ name: e.target.value, body: storyed.body })} />
          </Form.Item>
          <Form.Item label='Description'>
            <textarea cols='35' value={storyed.body} onChange={(e) => setStoryed({ name: storyed.name, body: e.target.value })} />
          </Form.Item>
          <Button type='primary' onClick={() => onSubmit(storyed)}>Save</Button>
        </InputContainer>
      </FormGrid>
    </Form>)
}