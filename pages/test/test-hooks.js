import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'
import { HooksExample } from '../../components/examples/hooks'
const Hi = () =>
  <FullPage>
    <h1>Hooks Example</h1>
    <HooksExample />
  </FullPage>

export default publicPage(Hi)
