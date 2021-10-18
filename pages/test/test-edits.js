
import { FullPage } from '../../components/VTheme/VTheme'
import { stories, StoryDetail, StoryStackWithNew, StoryForm, EditableStory } from '../../components/examples/edits'

const handleFormSubmit = (story) => {
  console.log('handleFormSubmit', story)
}
const TestEdits = () =>
  <FullPage>
    <h1>Edits Example</h1>
    <h2>Pure display component - StoryDetail</h2>
    <StoryDetail story={stories[0]} />

    <h2> Story Editor - StoryForm</h2>
    <StoryForm story={stories[1]} onSubmit={handleFormSubmit} />

    <h2> Editable Story - Editable Story</h2>
    <EditableStory story={stories[2]} />
    <h2>Stack of Stories - StoryStack</h2>
    <StoryStackWithNew stories={stories} />

  </FullPage>

export default TestEdits
