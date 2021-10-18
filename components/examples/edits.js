// React Components can be very very terse
import { useState } from 'react'
import styled from 'styled-components'

const Article = styled.article`
 
`

const EditableArticle = styled.div`
  width: 40rem;
  background-color: #f8f8f0;
  padding: 1rem;
  margin: 1rem 0 ;
  display: block;
  vertical-align: middle;
  font-size: 1rem;

  h1 {
    font-size: 2rem;
  }
  p {
    color: #404000;
  }
  label {
    text-align: right;
    margin-bottom: 1rem;
    display: inline-block;
    width: 5rem;
  }   
  textarea {
    margin-left: 5rem;
  } 
  input {
    display: inline-block;
    width: 80%;
    margin-left: 0.2rem;
  }
  button {
    margin: 1rem;
  }
`
const newStory = {
  title: '',
  body: ''
}

export const stories = [
  {
    title: 'things to come',
    body: 'In the city of Everytown in southern England, businessman John Cabal (Raymond Massey) cannot enjoy Christmas Day, 1940, with the news everywhere of possible war. His guest, Harding (Maurice Braddell), shares his worries, while another friend, the over-optimistic Pippa Passworthy (Edward Chapman), believes it will not come to pass, and if it does, it will accelerate technological progress. An aerial bombing raid on the city that night results in general mobilisation and then global war.',
    editable: true
  },
  {
    title: 'things to look forward to',
    body: `
    To get you thinking, here are some things you could look forward to on a weekly or daily basis:
a half-hour of peace to mediate or write in a journal.
a walk with a friend.
a bike ride through the park.
a bubble bath.
seeing a play or going to the theatre.
trying out a new restaurant.
calling a friend to chat.
reading a book.
`
  },
  {
    title: 'Things to be thankful for',
    body: `
    Let's have a look at 100 things to be thankful for today.
Your family and friends. Your health and wellbeing. The opportunity to have an education. ...
Fresh countryside walks. Cameras to capture amazing memories. Hitting the snooze button on your alarm. ...
Waking up every morning. Access to medication. ...
Comfortable clothes. Who you are.
`,
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
    <EditableArticle>
      <label>Title:</label>
      <input value={storyed.title} onChange={(e) => setStoryed({ title: e.target.value, body: storyed.body })} /><br />
      <textarea rows='5' cols='33' value={storyed.body} onChange={(e) => setStoryed({ title: storyed.title, body: e.target.value })} />
      <button onClick={() => onSubmit(storyed)}>Save</button>
      {/* <StoryDetail story={storyed} /> */}
    </EditableArticle>
  )
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
    <>
      <StoryForm story={newStory} onSubmit={handleSave} />
      <StoryStack stories={storyList} />
    </>
  )
}
