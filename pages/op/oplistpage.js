import { Button } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import OpList from '../../components/Op/OpList'
import { FullPage } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'

/*
  This is a basic crud listings page with no filters or anything
  as such its not really used in Voluntarily except as an admin check.
*/
export const OpListPage = ({ ops }) =>
  <FullPage>
    <Helmet>
      <title>Voluntarily - Opportunities List</title>
    </Helmet>
    <h1>
      <FormattedMessage
        id='opportunities'
        defaultMessage='Opportunities'
        description='Title of page listing opportunities'
      />
    </h1>
    <Button shape='round'>
      <Link href='/op/new'>
        <a>
          <FormattedMessage
            id='op.new'
            defaultMessage='New Opportunity'
            description='Button to create a new opportunity'
          />
        </a>
      </Link>
    </Button>
    <br /><br />
    <OpList ops={ops} />
  </FullPage>

OpListPage.getInitialProps = async ({ store }) => {
  // Get all OpListPage
  // warning: not a good example, don't return the got data in props,
  // let it be store in redux and you have the loading data too.
  const ops = await store.dispatch(reduxApi.actions.opportunities.get())
  return { ops }
}

OpListPage.propTypes = {
  ops: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })).isRequired
}

export default securePage(withOps(OpListPage))
