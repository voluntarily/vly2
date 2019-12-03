import ComingSoon from '../components/VTheme/ComingSoon'
import publicPage from '../hocs/publicPage'
import { FullPage } from '../components/VTheme/VTheme'

const Todo = () =>
  <FullPage>
    <ComingSoon>
      See our <a href='https://voluntarily.atlassian.net'>Jira List </a>
    </ComingSoon>
  </FullPage>

export default publicPage(Todo)
