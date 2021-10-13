import { useState } from 'react'
import { StoryForm } from '../../components/Story/StoryForm'
import Button from 'antd/lib/button'
import reduxApi from '../../lib/redux/reduxApi'
import { useDispatch } from 'react-redux'
import { StoryDetail } from '../../components/Story/StoryDetail'
import { FormattedMessage } from 'react-intl'

export const stories = []

export const EditableStory = ({ story }) => {
  const [editing, setEditing] = useState(false)
  const dispatch = useDispatch()

  const handleSave = async (story) => {
    await dispatch(reduxApi.actions.stories.put(
      { id: story._id },
      { body: JSON.stringify(story) })
    )
    setEditing(false)
  }

  return (
    editing
      ? (
        <StoryForm story={story} onSubmit={handleSave} />
        )
      : (
        <StoryDetail story={story}>
          <Button shape='round' type='primary' onClick={() => setEditing(true)}>
            <FormattedMessage id='story.edit' defaultMessage='Edit' description='Button to edit a story on updates tab' />
          </Button>
        </StoryDetail>
        )

  )
}
