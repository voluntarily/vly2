import { FullPage } from '../../components/VTheme/VTheme'
import styled from 'styled-components'

// Define our button, but with the use of props.theme this time
const Fill = styled.div`
 background-color: aliceblue;
`

const TestBlankPage = () => {
  return (
    <FullPage><Fill>&nbsp;</Fill></FullPage>
  )
}
export default TestBlankPage
