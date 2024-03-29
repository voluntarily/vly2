import { FullPage } from '../../components/VTheme/VTheme'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

// Define our button, but with the use of props.theme this time
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;

  /* Color the border and text with theme.main */
  color: ${props => props.theme.main};
  border: 2px solid ${props => props.theme.main};
`

const TestPublicPage = ({ locale, gssp, isAuthenticated }) => {
  const [me] = useSelector(state => [state.session.me])

  return (
    <FullPage>
      <h1>Simple Public Page</h1>
      <p>This page only has plain text on it and is wrapped by publicPage so has a header and footer</p>
      <p>Locale is: {locale}</p>
      <p>Me is: {me.nickname} </p>
      <Button>Themed</Button>
      <p>Session: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      {/* <p>Static Props: {gsp}</p> */}
      <p>ServerSide Props: {gssp}</p>

    </FullPage>
  )
}

// export async function getStaticProps (context) {
//   return {
//     props: {
//       gsp: 'test from GSP'
//     } // will be passed to the page component as props
//   }
// }

// export const getServerSideProps = reduxWrapper.getServerSideProps(store =>
//   async () => {
//     console.log('test-publicpage GSSP', store)
//     return {
//       props: {
//         gssp: 'test from GSSP'
//       } // will be passed to the page component as props
//     }
//   })

export default TestPublicPage
