import { useState } from 'react'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Button, Input } from 'antd'
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
            <input value={storyed.name} onChange={(e) => setStoryed({ ...storyed, name: e.target.value })} />
          </Form.Item>
          <Form.Item label={storyDescription}>
            <TextArea cols='35' value={storyed.body} onChange={(e) => setStoryed({ ...storyed, body: e.target.value })} />
          </Form.Item>
          <Button type='primary' onClick={() => onSubmit(storyed)}>
            <FormattedMessage id='story.publish' defaultMessage='Publish' description='Button to publish a story on updates tab' />
          </Button>
        </InputContainer>
      </FormGrid>
    </Form>
  )
}
