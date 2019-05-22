import publicPage, { FullPage } from '../hocs/publicPage'
import { Spacer } from '../components/VTheme/VTheme'
import BigSearch from '../components/VTheme/BigSearch'
import TitleSection from '../components/HeroPage/TitleSection'
import OpListSection from '../components/Op/OpListSection'

const TestPageTwo = ({ ...props }) => (
  <FullPage>
    <TitleSection title='Search results for Potatoes' />
    <BigSearch />
    <Spacer />
    <OpListSection />
  </FullPage>
)

export default publicPage(TestPageTwo)
