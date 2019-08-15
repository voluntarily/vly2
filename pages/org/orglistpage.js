import { Component } from 'react'
import { Button, Divider } from 'antd'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'
import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'
import OrgList from '../../components/Org/OrgList'
import { PageHeaderContainer, TextHeadingBlack, RequestButtonContainer } from '../../components/VTheme/VTheme'
import { Helmet } from 'react-helmet'

class OrgListPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all OrgListPage
    try {
      // TODO: [VP-451] Minimise org list download by only getting OrgCard required information using select.
      await store.dispatch(reduxApi.actions.organisations.get())
    } catch (err) {
      console.log('error in getting orgs', err)
    }
  }

  render () {
    const orgs = this.props.organisations.data
    const isAdmin = (this.props.me && this.props.me.role.includes('admin'))
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Organisation List</title>
        </Helmet>
        <PageHeaderContainer>
          <TextHeadingBlack><FormattedMessage
            defaultMessage='Organisations'
            id='org.list.heading' /></TextHeadingBlack>
          <RequestButtonContainer> {isAdmin && <Button type='primary' size='large' shape='round'><Link href='/org/new'><a>
            <FormattedMessage id='org.new' defaultMessage='New Organisation' description='Button to create a new organisation' />
          </a></Link></Button>}</RequestButtonContainer><p>Check out organisations doing social good on the Voluntarily platform</p>
        </PageHeaderContainer>
        <Divider />
        <OrgList orgs={orgs} />

      </FullPage>
    )
  };
}

export default publicPage(withOrgs(OrgListPage))
