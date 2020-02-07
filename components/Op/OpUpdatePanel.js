
import { useEffect } from 'react'
import { OpSectionGrid, ContentCard, P } from '../VTheme/VTheme'
import AddStory from '../../components/Story/AddStory'
import { StoryStack } from '../../components/Story/StoryStack'
import reduxApi, { withStories } from '../../lib/redux/reduxApi'

// start question

const OpUpdatePanel = ({ op, dispatch, stories, author }) => {
  // const [stories, setStories] = useState([{ name: 'name', body: 'description' }])

  useEffect(() => {
    const getStories = async () => { await dispatch(reduxApi.actions.stories.get({ parentId: op._id })) }
    getStories()
  }, [])

  const setStory = async (story) => {
    // save back to redux and mongo
    story.parent = op._id
    story.author = author
    console.log('setStory', story, op._id)

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
        {
          stories.data.length === 0 ? (
            <P>There is no update</P>
          ) : (
            <StoryStack stories={stories.data} />
          )
        }

      </ContentCard>

    </OpSectionGrid>

  )
}

export default withStories(OpUpdatePanel)
