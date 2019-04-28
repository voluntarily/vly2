import { Component } from 'react'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import Layout from '../../components/Layout'
import reduxApi, { withOrgs } from '../../redux/reduxApi.js'
import OrgList from '../../components/Org/OrgList'

class Orgs extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all Orgs
    const orgs = await store.dispatch(reduxApi.actions.organisations.get())
    return { orgs, query }
  }

  render () {
    const { orgs } = this.props
    return (
      <Layout className='fullpage'>
        <h1><FormattedMessage
          defaultMessage='Organisations'
          id='OrganisationsTitle' /></h1>
        <Button shape='round'><Link href='/org/new'><a>
          <FormattedMessage id='newOrg' defaultMessage='New Organisation' description='Button to create a new organisation' />
        </a></Link></Button>
        <OrgList orgs={orgs} />
      </Layout>
    )
  };
}

export default withOrgs(Orgs)
