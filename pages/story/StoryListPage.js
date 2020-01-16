import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'

const storyListPage = () =>
  <FullPage>
    <h1>Story List</h1>
  </FullPage>
module.exports = storyListPage
export default publicPage(storyListPage)
