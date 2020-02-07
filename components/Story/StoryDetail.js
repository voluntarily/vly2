import Html from '../VTheme/Html'

export const StoryDetail = ({ story, children }) =>

  <article>
    <h1>{story.name}</h1>
    {story.imgUrl && <img src={story.imgUrl} />}
    <Html>
      {story.body}
    </Html>
    {children}
    <footer>
      <span>{story.author && story.author.name}</span>
      <span>{story.publishedDate}</span>
      {children}
    </footer>
    <button>Reply</button>
  </article>

export default StoryDetail