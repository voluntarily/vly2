// [@TODO] - remove Input once actual search component is done
import { Button, Input } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import ActList from '../../components/Act/ActList'
import ActMenu from '../../components/Act/ActMenu'
import NoResult from '../../components/NoResult'
import { ActivityContainer, FullPage, GridContainer, PageHeaderContainer, RequestButtonContainer } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withActs } from '../../lib/redux/reduxApi.js'

const escapeRegex = require('../../server/util/regexUtil')

const SearchContainer = styled.div`
  background: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(117, 117, 117, 0.5);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`
const TabContainer = styled.div`
  margin: 1.5rem 0 0 0;
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

export const ActListPage = ({ acts }) =>
  <FullPage>
    <Helmet>
      <title>Voluntarily - Activities List</title>
    </Helmet>
    <PageHeaderContainer>
      <h1>
        <FormattedMessage
          id='ActListPage.Title'
          defaultMessage='Activities'
          description='Title of page listing activities'
        />
      </h1>

      <RequestButtonContainer>
        <Button type='primary' shape='round' size='large'>
          <Link href='/act/new'>
            <a>
              <FormattedMessage
                id='act.new'
                defaultMessage='New activity'
                description='Button to create a new activity'
              />
            </a>
          </Link>
        </Button>
      </RequestButtonContainer>
      <p>
        Find activity templates that make it easy to bring volunteers into your classroom
      </p>
    </PageHeaderContainer>
    {/* <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
      <TabPane tab={activityTab} key='1'> */}
    <ActivityContainer>
      <TabContainer>
        {' '}
        <ActMenu acts={acts} />
      </TabContainer>
      <TabContainer>
        <SearchContainer>
          <p>Search activities</p>
          <Input.Search
            placeholder='eg: activity'
            enterButton='Search'
            size='large'
            onSearch={handleSearch}
          />
        </SearchContainer>

        {acts.length > 0 ? (
          <ActList acts={acts} />
        ) : (
          <NoResult
            id='act.noresult'
            msg='No activities found based on your search criteria'
            description='Message shown while no activities found'
          />
        )}
      </TabContainer>
    </ActivityContainer>
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
  const acts = await store.dispatch(
    reduxApi.actions.activities.get({
      ...query
    })
  )
  return { acts, query }
}
ActListPage.propTypes = {
  acts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      description: PropTypes.string,
      duration: PropTypes.string,
      status: PropTypes.string,
      _id: PropTypes.string.isRequired
    })
  ).isRequired
  //  showAddAct: PropTypes.bool.isRequired,
  // dispatch: PropTypes.func.isRequired
}

export default publicPage(withActs(ActListPage))
