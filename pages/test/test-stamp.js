
import { FullPage } from '../../components/VTheme/VTheme'
import styled from 'styled-components'
import { Stamp } from '../../components/VTheme/Stamp'
import { OpStatusStamp } from '../../components/Op/OpStatus'
export const Rect = styled.div`
  display: block; /* Hidden by default */
  width: 20rem; 
  height: 20rem;
  margin: 1rem;
  padding: 1rem;
  border: solid;
  background-color: ivory; 
  position: relative;
  
`

const TestPublicPage = ({ locale, session, isAuthenticated }) =>
  <FullPage>
    <h1>Simple Public Page</h1>
    <Rect>
      <p>This is the content of the rectangle </p>
      <Stamp>Completed</Stamp>
    </Rect>
    <Rect>
      <OpStatusStamp status='draft' />
    </Rect>
  </FullPage>

export default TestPublicPage
