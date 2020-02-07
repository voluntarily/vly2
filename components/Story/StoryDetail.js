
export const StoryDetail = ({ story, children }) =>
  <article>
    <h3>{story.title}</h3>
    <p>{story.body}</p>
    {children}
    <button>Reply</button>

  </article>
