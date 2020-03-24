// [@TODO] - remove Input once actual search component is done
import { Input } from 'antd'
import Router from 'next/router'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import ActList from '../../components/Act/ActList'
import NoResult from '../../components/NoResult'
import { FullPage, GridContainer, PageBannerNoTabs, PageBannerButtons } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withActs } from '../../lib/redux/reduxApi.js'
import ActAdd from '../../components/Act/ActAdd'

const escapeRegex = require('../../server/util/regexUtil')

const SearchContainer = styled.div`
  background: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(117, 117, 117, 0.5);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`
const handleSearch = (value) => {
  if (!value) { return false }
  value = escapeRegex(value)

  Router.push({
    pathname: '/acts',
    query: {
      search: value
    }
  })
}

export const ActListPage = ({ activities }) =>
  <FullPage>
    <Helmet>
      <title>Voluntarily - Resources List</title>
    </Helmet>
    <PageBannerNoTabs>
      <h1>
        <FormattedMessage
          id='ActListPage.Title'
          defaultMessage='Activities'
          description='Title of page listing resources for teachers'
        />
      </h1>

      <PageBannerButtons>
        <ActAdd />
      </PageBannerButtons>
      <FormattedMessage
        defaultMessage='Find activities to help or be helped with'
        id='act.list.subtitle'
      />
    </PageBannerNoTabs>
    {/* <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
      <TabPane tab={activityTab} key='1'> */}

    <SearchContainer>
      <Input.Search
        placeholder='eg: Grocery shopping'
        enterButton='Search'
        size='large'
        onSearch={handleSearch}
      />
    </SearchContainer>

    {activities.data.length > 0 ? (
      <ActList acts={activities.data} />
    ) : (
      <NoResult
        id='act.noresult'
        msg='No activities found based on your search criteria'
        description='Message shown while no activities found'
      />
    )}

    {/* </TabPane>
    </Tabs> */}
    <GridContainer>
      <br />
      <br />

      {/* [@TODO] Replace with actual searchbar component */}
    </GridContainer>
  </FullPage>

ActListPage.getInitialProps = async ({ store, query }) => {
  // Get all Acts
  return store.dispatch(
    reduxApi.actions.activities.get({
      ...query
    })
  )
}

export default securePage(withActs(ActListPage))
