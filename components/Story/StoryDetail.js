import Html from '../VTheme/Html'
​
export const StoryDetail = ({ story, children }) =>
  <article>
    <h1>{story.name}</h1>
    {story.imgUrl && <img src={story.imgUrl} />}
    <Html>
      {story.body}
    </Html>
    <footer>
      <span>{story.author && story.author.name}</span>
      <span>{story.publishedDate}</span>
      {children}
    </footer>
  </article>
​
​
<StoryDetail story={stories.data[0]} >
  <Button>Edit</Button>
  <Button>Delete</Button>
  <Button>Reply</Button>
</StoryDetail>
