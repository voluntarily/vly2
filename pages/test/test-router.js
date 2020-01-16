import { UseRouter } from '../../components/examples/UseRouter.js'
import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'

const TestRouter = () =>
  <FullPage>
    <UseRouter href='/'>
      Routes to Home page
    </UseRouter>
  </FullPage>
export default publicPage(TestRouter)
