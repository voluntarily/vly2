import { EditableStory } from '../../components/Story/EditableStory'
import { StoryDetail } from '../../components/Story/StoryDetail'
import moment from 'moment'

export const StoryStack = ({ stories }) => {
  return stories
    .sort((a, b) => moment(b.createdAt) - moment(a.createdAt))
    .map((story, index) => {
      return !story.editable
        ? <EditableStory key={index} story={story} />
        : <StoryDetail key={index} story={story} />
    })
}
