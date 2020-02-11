import { useCallback } from 'react'
import { Button, message, Popconfirm } from 'antd'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import reduxApi, { withStories } from '../../lib/redux/reduxApi.js'
import { StoryStatus } from '../../server/api/story/story.constants'

export const DeleteStory = ({ story, dispatch }) => {
  const router = useRouter()

  const handleCancelStory = useCallback(
    async () => {
      await dispatch(
        reduxApi.actions.stories.put(
          { id: story._id },
          { body: JSON.stringify({ status: StoryStatus.CANCELLED }) }
        )
      )
      message.success('Story Deleted')
      router.replace('/home')
    }, [])

  return (
    <>
      <Popconfirm id='cancelStoryPopConfirm' title='Confirm delete of this story.' onConfirm={handleCancelStory} okText='Yes' cancelText='No'>
        <Button shape='round' type='secondary'>
          <FormattedMessage id='story.delete' defaultMessage='Delete' description='Button to delete a story on updates tab' />
        </Button>
      </Popconfirm>
    </>

  )
}

export default withStories(DeleteStory)
