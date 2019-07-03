import { Component } from 'react'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'
import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'
import OrgList from '../../components/Org/OrgList'

class OrgListPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all OrgListPage
    try {
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
        <h1><FormattedMessage
          defaultMessage='Organisations'
          id='org.list.heading' /></h1>
        <OrgList orgs={orgs} />

        { isAdmin && <Button shape='round'><Link href='/org/new'><a>
          <FormattedMessage id='org.new' defaultMessage='New Organisation' description='Button to create a new organisation' />
        </a></Link></Button>}
      </FullPage>
    )
  };
}

export default publicPage(withOrgs(OrgListPage))
