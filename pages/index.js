import { getSession } from '../lib/auth/auth'
import { Role } from '../server/services/authorize/role'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { wrapper } from '../lib/redux/store'
import PublicPage from '../hocs/publicPage'
const RootPage = (props) => {
  // console.log('RootPage', props)
  const { tick, session } = useSelector(state => state)
  return (

    <>
      <h1>Testing Server side props</h1>
      <p>
        {session.isAuthenticated
          ? 'authenticated'
          : 'not authenticated'}
      </p>
      <p>name: {session.user.name}</p>
      <p>name: {props.user.name}</p>

      <div>tick: {tick}</div>
    </>
  )
}
RootPage.displayName = 'RootPage'

// export const getServerSideProps = wrapper.getServerSideProps(store =>
//   async ({ req, res }) => {
//     // should session be in the props or the store or both?
//     return {
//       props: { index: 'index.js' }
//     }
//   }
// )

export default RootPage
