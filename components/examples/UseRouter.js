/* Example of using useRouter in a functional component
   and matching test
*/

import { useRouter } from 'next/router'
export const UseRouter = (props, context) => {
  const router = useRouter()
  const { children, href } = props
  const handleClick = () => {
    router.push(href)
  }

  return (
    <>
      <h1>Router Example</h1>
      <dl>
        <dt>pathname</dt><dd>{router.pathname}</dd>
        <dt>asPath</dt><dd>{router.asPath}</dd>
        <dt>query</dt><dd>{JSON.stringify(router.query)}</dd>

      </dl>
      <button onClick={handleClick}>
        {children}
      </button>
    </>
  )
}

export default UseRouter
