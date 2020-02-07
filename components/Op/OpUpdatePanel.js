
import { useEffect } from 'react'
import { OpSectionGrid, ContentCard } from '../VTheme/VTheme'
import AddStory from '../../components/Story/AddStory'
import { StoryStack } from '../../components/Story/StoryStack'
import reduxApi, { withStories } from '../../lib/redux/reduxApi'

// start question

const OpUpdatePanel = ({ op, dispatch, stories }) => {
  // const [stories, setStories] = useState([{ name: 'name', body: 'description' }])

  useEffect(() => {
    const getStories = async () => { await dispatch(reduxApi.actions.stories.get()) }
    getStories()
  }, [])

  const setStory = async (story) => {
    // save back to redux and mongo
    console.log('setStory', story)
    story.parent = op._id
    await dispatch(reduxApi.actions.stories.post(
      {},
      { body: JSON.stringify(story) })
    )
  }

  return (

    <OpSectionGrid>
      <div>
        <h2>Updates</h2>
        <>
          <AddStory onSubmit={(story) => { setStory(story) }} />

        </>

      </div>

      <ContentCard>
        <h3>Story List</h3>

        {console.log('OpUpdatePanel', stories)}
        <StoryStack stories={stories.data} />

      </ContentCard>

    </OpSectionGrid>

  )
}

export default withStories(OpUpdatePanel)
