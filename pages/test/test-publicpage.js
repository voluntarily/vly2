import { FullPage } from '../../components/VTheme/VTheme'
import styled from 'styled-components'

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

const TestPublicPage = ({ locale, session, isAuthenticated }) =>
  <FullPage>
    <h1>Simple Public Page</h1>
    <p>This page only has plain text on it and is wrapped by publicPage so has a header and footer</p>
    <p>Locale is: {locale}</p>
    <Button>Themed</Button>
    <p>Session: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
  </FullPage>

export default TestPublicPage
