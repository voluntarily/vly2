import ComingSoon from '../../../components/VTheme/ComingSoon'
import publicPage from '../../../hocs/publicPage'
import { FullPage } from '../../../components/VTheme/VTheme'

const Ready = () =>
  <FullPage>
    <h1>School Ready</h1>
    <ComingSoon />
  </FullPage>

export default publicPage(Ready)
