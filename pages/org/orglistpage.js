import { Button } from 'antd'
import Link from 'next/link'
import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import OrgList from '../../components/Org/OrgList'
import { FullPage, PageBanner, PageBannerButtons } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'

class OrgListPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all OrgListPage
    try {
      const select = { p: 'name imgUrl category' }
      await store.dispatch(reduxApi.actions.organisations.get(select))
    } catch (err) {
      console.error('error in getting orgs', err)
    }
  }

  render () {
    const orgs = this.props.organisations.data
    const isAdmin = (this.props.me && this.props.me.role.includes('admin'))
    return (
      <FullPage>
        <Helmet>
          <title>Organisations / Voluntarily</title>
        </Helmet>
        <PageBanner>
          <h1>
            <FormattedMessage
              defaultMessage='Organisations'
              id='org.list.heading'
            />
          </h1>
          <PageBannerButtons>
            {isAdmin &&
              <Button type='primary' size='large' shape='round'>
                <Link href='/org/new'>
                  <a>
                    <FormattedMessage id='org.new' defaultMessage='New Organisation' description='Button to create a new organisation' />
                  </a>
                </Link>
              </Button>}
          </PageBannerButtons>
          <FormattedMessage
            defaultMessage='Check out organisations doing social good on the Voluntarily platform'
            id='org.list.subtitle'
          />
        </PageBanner>
        <OrgList orgs={orgs} />

      </FullPage>
    )
  };
}

export default publicPage(withOrgs(OrgListPage))
