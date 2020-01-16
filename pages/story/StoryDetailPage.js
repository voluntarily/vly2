import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'

export const storyDetailPage = () =>
  <FullPage>
    <h1>Story Detail</h1>
  </FullPage>

export default publicPage(storyDetailPage)
