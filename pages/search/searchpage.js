import publicPage, { FullPage } from '../../hocs/publicPage'
import TitleSectionSub from "../../components/HeroPage/TitleSectionSub";
import BigSearch from "../../components/VTheme/BigSearch";
import { Spacer } from "../../components/VTheme/VTheme";
import OpListSection from "../../components/Op/OpListSection";




const SearchPage = ({ ...props }) => {

  

  <FullPage>
    <TitleSectionSub title="Search results for Potatoes" />
    <BigSearch />
    <Spacer />
    <OpListSection />

  </FullPage>
}

export default publicPage(SearchPage)

