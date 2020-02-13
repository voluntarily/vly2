import { useState } from 'react'
import { StoryForm } from '../../components/Story/StoryForm'
import { StoryDetail } from '../../components/Story/StoryDetail'

export const stories = []

export const EditableStory = ({ story }) => {
  const [editing, setEditing] = useState(false)
  const [storyview, setStoryview] = useState(story)

  const handleSave = (story) => {
    // should write to database
    setStoryview(story)
    setEditing(false)
  }
  return (
    editing
      ? (
        <>
          <StoryForm story={storyview} onSubmit={handleSave} />
        </>)
      : (
        <>
          <StoryDetail story={storyview}>
            <button onClick={() => setEditing(true)}>Edit Story</button>
          </StoryDetail>
        </>)

  )
}
