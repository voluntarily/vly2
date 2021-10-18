
import { useEffect } from 'react'
import { OpSectionGrid, ContentCard, P } from '../VTheme/VTheme'
import AddStory from '../../components/Story/AddStory'
import { StoryStack } from '../../components/Story/StoryStack'
import reduxApi, { withStories } from '../../lib/redux/reduxApi'
import { FormattedMessage } from 'react-intl'

// start question

const OpUpdatePanel = ({ albumId, dispatch, stories, author }) => {
  useEffect(() => {
    const getStories = async () => { await dispatch(reduxApi.actions.stories.get({ parentId: albumId })) }
    getStories()
  }, [dispatch, albumId])

  const setStory = async (story) => {
    // save back to redux and mongo
    story.parent = albumId
    story.author = author
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
          stories.data.length === 0
            ? (
              <P>
                <FormattedMessage
                  id='storyUpdate'
                  defaultMessage='Check here for updates about this activity'
                  description='Description shown if no updates have been created'
                />
              </P>
              )
            : (
              <StoryStack stories={stories.data} />
              )
        }

      </ContentCard>

    </OpSectionGrid>

  )
}

export default withStories(OpUpdatePanel)
