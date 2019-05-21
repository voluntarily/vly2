import { Component } from 'react'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'
import OrgList from '../../components/Org/OrgList'

class Orgs extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all Orgs
    // console.log('getting orgs')
    try {
      const orgs = await store.dispatch(reduxApi.actions.organisations.get())
      // console.log('got orgs', orgs)
      return { orgs, query }
    } catch (err) {
      console.log('error in getting orgs', err)
    }
  }

  render () {
    const { orgs } = this.props
    return (
      <FullPage>
        <h1><FormattedMessage
          defaultMessage='Organisations'
          id='org.list.heading' /></h1>
        <Button shape='round'><Link href='/org/new'><a>
          <FormattedMessage id='org.new' defaultMessage='New Organisation' description='Button to create a new organisation' />
        </a></Link></Button>
        <OrgList orgs={orgs} />
      </FullPage>
    )
  };
}

export default securePage(withOrgs(Orgs))
