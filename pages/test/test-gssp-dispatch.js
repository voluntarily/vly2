import { FullPage } from '../../components/VTheme/VTheme'
import styled from 'styled-components'
import { reduxWrapper } from '../../lib/redux/store'
import { useSelector } from 'react-redux'
import reduxApi from '../../lib/redux/reduxApi.js'

// Define our button, but with the use of props.theme this time
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;

`

const TestGSSPDispatch = ({ locale, gssp, isAuthenticated }) => {
  const [me, orgs] = useSelector(state => [state.session.me, state.organisations.data])
  console.log(orgs)
  return (
    <FullPage>
      <h1>Simple Public Page</h1>
      <p>This page only has plain text on it and is wrapped by publicPage so has a header and footer</p>
      <p>Locale is: {locale}</p>
      <p>Me is: {me.nickname} </p>
      <Button>Styled Button</Button>
      <p>Session: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      {/* <p>Static Props: {gsp}</p> */}
      <p>ServerSide Props: {gssp}</p>
      <h2>Organisations</h2>
      <ul>
        {orgs.map(o => <li key={o.name}>{o.name}</li>)}
      </ul>
    </FullPage>)
}

export const getServerSideProps = reduxWrapper.getServerSideProps(store =>
  async () => {
    console.log('test-gssp-dispatc GSSP', store)
    const select = { p: 'name imgUrl role' }
    await store.dispatch(reduxApi.actions.organisations.get(select))
  })

export default TestGSSPDispatch
