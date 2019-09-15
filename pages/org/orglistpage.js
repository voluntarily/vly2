import { Button, Divider } from 'antd'
import Link from 'next/link'
import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import OrgList from '../../components/Org/OrgList'
import { FullPage, H3Black, PageHeaderContainer, RequestButtonContainer } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'

class OrgListPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all OrgListPage
    try {
      // TODO: [VP-451] Minimise org list download by only getting OrgCard required information using select.
      const select = {
        name: 1,
        imgUrl: 1,
        about: 1,
        category: 1
      }
      const pselect = { p: select }
      await store.dispatch(reduxApi.actions.organisations.get(pselect))
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
          <H3Black><FormattedMessage
            defaultMessage='Organisations'
            id='org.list.heading' /></H3Black>
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
