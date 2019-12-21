/* This component allows an HTML string to be displayed
 in a react page.
 The html should be sanitised
 */

export const Html = ({ children }) =>
  <div dangerouslySetInnerHTML={{ __html: children }} />

export default Html
