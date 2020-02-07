import { useState } from 'react'

const newStory = {
  title: '',
  body: ''
}

export const StoryForm = ({ story, onSubmit }) => {
  const [storyed, setStoryed] = useState(story)

  return (
    <article>
      <label>Title:</label>
      <input value={storyed.title} onChange={(e) => setStoryed({ title: e.target.value, body: storyed.body })} /><br />
      <textarea rows='5' cols='33' value={storyed.body} onChange={(e) => setStoryed({ title: storyed.title, body: e.target.value })} />
      <button onClick={() => onSubmit(storyed)}>Save</button>
      {/* <StoryDetail story={storyed} /> */}
    </article>)
}

export const CreateSory = ({ stories }) => {
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