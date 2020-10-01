import { FullPage, PageBanner } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import TagManagementTab from '../../components/TagManagement/TagManagementTab'
import { FormattedMessage } from 'react-intl'

export const TagMgmtPage = (props) => {
  return (
    <FullPage>
      <PageBanner>
        <h1>Tag TagManagement</h1>
      </PageBanner>
      <TagManagementTab />

    </FullPage>
  )
}

export default securePage(TagMgmtPage)
