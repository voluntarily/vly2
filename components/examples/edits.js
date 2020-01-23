// React Components can be very very terse
import { useState } from 'react'
import styled from 'styled-components'

const Demo = styled.div`

  p {
    width: 40rem;
    margin-bottom: 1rem;
  }
  label {
    text-align: right;
    margin-bottom: 1rem;
    display: inline-block;
    width: 5rem;
  }    
  input {
    display: inline-block;
    width: 4rem;
    margin-left: 0.2rem;
  }
`
const Article = styled.article`
  width: 40rem;
  background-color: #f8f8f0;
  color: white;
  margin: 1rem 0 ;
  display: block;
  vertical-align: middle;
  text-align: center;
  font-size: 1.8em;

  h1 {
    font-size: 2rem;
  }
  p {
    color: #404000;
  }
`

const newStory = {
  title: '',
  body: ''
}

export const stories = [
  {
    title: 'things to do',
    body: 'a;sdlkfja ;dsjkfalksjdf laksdjf lasdkdfh alksjfdh alskf halskfh ',
    editable: true
  },
  {
    title: 'More things to do',
    body: 'a;sdlkfja ;dsjkfalksjdf laksdjf lasdkdfh alksjfdh alskf halskfh '
  },
  {
    title: 'Even More things to do',
    body: 'a;sdlkfja ;dsjkfalksjdf laksdjf lasdkdfh alksjfdh alskf halskfh ',
    editable: true

  }
]

export const StoryDetail = ({ story, children }) =>
  <Article>
    <h1>{story.title}</h1>
    <p>{story.body}</p>
    {children}
    <button>Reply</button>

  </Article>

export const StoryForm = ({ story, onSubmit }) => {
  const [storyed, setStoryed] = useState(story)

  return (
    <div>
      <label>Title:</label>
      <input value={storyed.title} onChange={(e) => setStoryed({ title: e.target.value, body: storyed.body })} /><br />
      <input value={storyed.body} onChange={(e) => setStoryed({ title: storyed.title, body: e.target.value })} />
      <button onClick={() => onSubmit(storyed)}>Save</button>
      {/* <StoryDetail story={storyed} /> */}
    </div>)
}

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

export const StoryStack = ({ stories }) => {
  return stories.map((story, index) => {
    return story.editable
      ? <EditableStory key={index} story={story} />
      : <StoryDetail key={index} story={story} />
  })
}

export const StoryStackWithNew = ({ stories }) => {
  const [storyList, setStoryList] = useState(stories)

  const handleSave = (story) => {
    setStoryList([story, ...storyList])
  }
  return (
    <Demo>
      <StoryForm story={newStory} onSubmit={handleSave} />
      <StoryStack stories={storyList} />
    </Demo>
  )
}
