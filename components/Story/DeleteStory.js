import { Button, message, Popconfirm } from 'antd'
import { FormattedMessage } from 'react-intl'
import reduxApi, { withStories } from '../../lib/redux/reduxApi.js'

export const DeleteStory = ({ story, dispatch }) => {

  // default delete
  const handleDeleteStory = async () => {
    await dispatch(reduxApi.actions.stories.delete({ id: story._id }))
    message.success('Story Deleted')
  }

  return (
    <>
      <Popconfirm id='cancelStoryPopConfirm' title='Confirm delete of this story.' onConfirm={handleDeleteStory} okText='Yes' cancelText='No'>
        <Button shape='round' type='danger'>
          <FormattedMessage id='story.delete' defaultMessage='Delete' description='Button to delete a story on updates tab' />
        </Button>
      </Popconfirm>
    </>

  )
}

export default withStories(DeleteStory)
