import { FullPage, PageBanner } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import TagManagementTab from '../../components/TagManagement/TagManagementTab'
import { FormattedMessage } from 'react-intl'

export const TagMgmtPage = (props) => {
  return (
    <FullPage>
      <PageBanner>
        <FormattedMessage id='TagManagement.title' defaultMessage='Tag Management' description='Header of the tag management page' />
      </PageBanner>
      <TagManagementTab />

    </FullPage>
  )
}

export default securePage(TagMgmtPage)
