import { useState } from 'react'
import { StoryForm } from '../../components/Story/StoryForm'
import Button from 'antd/lib/button'
import reduxApi, { withStories } from '../../lib/redux/reduxApi'
import { useDispatch } from 'react-redux'
import { StoryDetail } from '../../components/Story/StoryDetail'

export const stories = []

export const EditableStory = ({ roles, story }) => {
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
          <>
            <StoryForm story={story} onSubmit={handleSave} />
          </>)
      : (
        <StoryDetail story={story}>
          <Button shape='round' type='primary' onClick={() => setEditing(true)}>Edit</Button>
        </StoryDetail>
      )

  )
}
export default withStories(EditableStory)
