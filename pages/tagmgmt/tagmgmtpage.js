import { FullPage, PageBanner } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import TagManagementTab from '../../components/TagManagement/TagManagementTab'
import reduxApi, { withTagManagement } from '../../lib/redux/reduxApi.js'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

export const TagMgmtPage = (props) => {
 

  return (
    <FullPage>
      <PageBanner>
        <h1>Tag Management</h1>
      </PageBanner>
      <TagManagementTab/>

    </FullPage>
  )
}

export default securePage(withTagManagement(TagMgmtPage))
