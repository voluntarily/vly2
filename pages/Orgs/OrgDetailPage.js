import { Component } from 'react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Button, Popconfirm, message } from 'antd'
import reduxApi, { withOrgs } from '../../redux/reduxApi.js'
import Layout from '../../components/Layout'
import OrgDetail from '../../components/Org/OrgDetail'

class OrgDetailPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Org
    console.log('OrgDetailPage:getInitialProps:', store, query)
    const orgs = await store.dispatch(reduxApi.actions.organisations.get(query))
    return { orgs, query }
  }

  handleDelete (index, orgId, event) {
    const callbackWhenDone = () => this.setState({ inProgress: false })
    this.setState({ inProgress: orgId })
    // Actual data request
    this.props.dispatch(reduxApi.actions.organisations.delete({ id: orgId }, callbackWhenDone))
  }

  cancel = () => { message.error('Delete Cancelled') }

  render () {
    let content
    if (this.props.orgs && this.props.orgs.length === 1) {
      const org = this.props.orgs[0]
      content =
        <Layout className='fullpage'>
          <h1><FormattedMessage defaultMessage='Organisation' id='OrganisationTitle' /></h1>
          <OrgDetail org={org} />
          <Link href={`/orgs/${org._id}/edit`} >
            <Button type='secondary' shape='round' >
              <FormattedMessage id='editOrg' defaultMessage='Edit' description='Button to edit an organisation on OrgDetails page' />
            </Button>
          </Link>
            &nbsp;
          <Popconfirm title='Confirm removal of this organisation.' onConfirm={this.handleDelete} onCancel={this.cancel} okText='Yes' cancelText='No'>
            <Button type='danger' shape='round' >
              <FormattedMessage id='deleteOrg' defaultMessage='Remove Organisation' description='Button to remove an Organisatino on OrgDetails page' />
            </Button>
          </Popconfirm>
          &nbsp;
          <Button><Link href='/orgs'><a>
            <FormattedMessage id='showOrgs' defaultMessage='Show All' description='Button to show all organisations' />
          </a></Link></Button>
          <br /><small>buttons visible here will depend on user role</small>
        </Layout>
    } else {
      content =
        <div>
          <h2>Sorry this organisation is not available</h2>
          <Button><Link href='/orgs'><a>
            <FormattedMessage id='showOrgs' defaultMessage='Show All' description='Button to show all organisations' />
          </a></Link></Button>
          <Button shape='round'><Link href='/org/new'><a>
            <FormattedMessage id='newOrg' defaultMessage='New Organisation' description='Button to create a new organisation' />
          </a></Link></Button>
        </div>
    }
    return (content)
  };
}

export default withOrgs(OrgDetailPage)
