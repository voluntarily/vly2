import { FullPage, PageBanner } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import { FormattedMessage } from 'react-intl'
import TagManagementTab from '../../components/TagManagement/TagManagementTab'

export const TagMgmtPage = (props) => {
  return (
    <FullPage>
      <PageBanner>
        <h1>
          <FormattedMessage
            id='tagmgmtpage.title'
            defaultMessage='Tag Management'
            description='Title on tag management page'
          />
        </h1>
      </PageBanner>

      <TagManagementTab />

    </FullPage>
  )
}

export default securePage(TagMgmtPage)
