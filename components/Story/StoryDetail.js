import { H3, P } from '../VTheme/VTheme'
import Button from 'antd/lib/button'
import { Divider } from 'antd'
import moment from 'moment'
import DeleteStory from '../../components/Story/DeleteStory'
import { useState } from 'react'

export const StoryDetail = ({ story, children }) => {
  const SeeMore = ({ storyBody, maxLength }) => {
    const [expand, setExpand] = useState(true)

    if (storyBody <= maxLength) {
      return (
        <P> {storyBody} </P>
      )
    }
    return (
      <P>
        {expand ? `${storyBody.substr(0, maxLength).trim()} ...` : storyBody}
        {expand ? (
          <a onClick={() => setExpand(false)}> read more </a>
        ) : (
          <a onClick={() => setExpand(true)}> read less </a>
        )}
      </P>
    )
  }

  return (
    <article>
      <H3>{story.name}</H3>
      {story.imgUrl && <img src={story.imgUrl} />}
      <SeeMore storyBody={story.body} maxLength={250} />
      <footer>
        <span item={story.author} path='author'> By {story.author && story.author.name}</span> &nbsp;
        <span>{moment(story.dateAdded).fromNow()}</span>
      </footer>
      <br />
      <Button shape='round' type='secondary'>Reply</Button>
      {children}
      <DeleteStory story={story} />
      <Divider />
    </article>
  )
}
export default StoryDetail
