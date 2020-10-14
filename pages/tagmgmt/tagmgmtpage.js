import { FullPage, PageBanner } from '../../components/VTheme/VTheme'
import adminPage from '../../hocs/adminPage'
import TagManagementTab from '../../components/TagManagement/TagManagementTab'
import reduxApi from '../../lib/redux/reduxApi.js'
import Loading from '../../components/Loading'
import { useSelector } from 'react-redux'

export const TagMgmtPage = (props) => {
  const aliases = useSelector(state => state.aliases)
  if (!aliases.sync) { return <FullPage><Loading label='aliases' entity={aliases} /></FullPage> }
  if (aliases.sync) {
    return (
      <FullPage>
        <PageBanner>
          <h1>Tag Management</h1>
        </PageBanner>
        <TagManagementTab aliases={aliases} />

      </FullPage>
    )
  }
}

TagMgmtPage.getInitialProps = async ({ store }) => {
  try {
    store.dispatch(reduxApi.actions.tags.get())
    return store.dispatch(reduxApi.actions.aliases.get())
  } catch (err) {
    console.errpr('error in getting tag management page data', err)
  }
}

export default adminPage(TagMgmtPage)
