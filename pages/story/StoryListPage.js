import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'

export const storyListPage = () =>
  <FullPage>
    <h1>Story List</h1>
  </FullPage>

export default publicPage(storyListPage)
