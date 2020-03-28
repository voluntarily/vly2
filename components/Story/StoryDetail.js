import { H3 } from '../VTheme/VTheme'
import Button from 'antd/lib/button'
import styled from 'styled-components'
import moment from 'moment'
import DeleteStoryButton from '../../components/Story/DeleteStory'
import { ExpandText } from '../Story/ExpandText'

const Article = styled.article`
  padding: 1rem;
  button {
    margin: 3px;
  }
  border-bottom: 1px solid;
`
export const StoryDetail = ({ story, children }) => {
  return (
    <Article>
      <H3>{story.name}</H3>
      {story.imgUrl && <img src={story.imgUrl} />}
      <ExpandText storyBody={story.body} maxLength={250} />
      <footer>
        <span item={story.author} path='author'> By {story.author && story.author.name}</span> &nbsp;
        <span>{moment(story.createdAt).fromNow()}</span>
      </footer>
      <br />
      <Button shape='round' type='secondary'>Reply</Button>
      {children}
      <DeleteStoryButton story={story} />
    </Article>
  )
}
export default StoryDetail
