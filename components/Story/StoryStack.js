import { EditableStory } from '../../components/Story/EditableStory'
import { StoryDetail } from '../../components/Story/StoryDetail'
import { useState } from 'react'

export const StoryStack = ({ stories }) => {
  return stories.map((story, index) => {
    return story.editable
      ? <EditableStory key={index} story={story} />
      : <StoryDetail key={index} story={story} />
  })
}

export const StoryStackWithNew = ({ stories }) => {
  const [storyList] = useState(stories)

  return (
    <>
      <StoryStack stories={storyList} />
    </>
  )
}