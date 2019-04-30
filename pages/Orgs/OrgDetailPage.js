import { Component } from 'react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Button, Popconfirm, message } from 'antd'
import reduxApi, { withOrgs } from '../../redux/reduxApi.js'
import publicPage, { FullPage } from '../../hocs/publicPage'
import OrgDetail from '../../components/Org/OrgDetail'
import Router from 'next/router'

class OrgDetailPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Org
    const orgs = await store.dispatch(reduxApi.actions.organisations.get(query))
    return { orgs, query }
  }

  async handleDelete (org) {
    if (!org) return
    // Actual data request
    await this.props.dispatch(reduxApi.actions.organisations.delete({ id: org._id }))
    // TODO error handling - how can this fail?
    message.success('Deleted. ')
    Router.replace(`/orgs`)
  }

  cancel = () => { message.error('Delete Cancelled') }

  render () {
    let content
    if (this.props.orgs && this.props.orgs.length === 1) {
      const org = this.props.orgs[0]
      content =
        <FullPage>
          <h1><FormattedMessage defaultMessage='Organisation' id='OrganisationTitle' /></h1>
          <OrgDetail org={org} />
          <Link href={`/orgs/${org._id}/edit`} >
            <Button type='secondary' shape='round' >
              <FormattedMessage id='editOrg' defaultMessage='Edit' description='Button to edit an organisation on OrgDetails page' />
            </Button>
          </Link>
            &nbsp;
          <Popconfirm title='Confirm removal of this organisation.' onConfirm={this.handleDelete.bind(this, org)} onCancel={this.cancel} okText='Yes' cancelText='No'>
            <Button type='danger' shape='round' >
              <FormattedMessage id='deleteOrg' defaultMessage='Remove Organisation' description='Button to remove an Organisatino on OrgDetails page' />
            </Button>
          </Popconfirm>
          &nbsp;
          <Button shape='round'><Link href='/orgs'><a>
            <FormattedMessage id='showOrgs' defaultMessage='Show All' description='Button to show all organisations' />
          </a></Link></Button>
          <br /><small>buttons visible here will depend on user role</small>
        </FullPage>
    } else {
      content =
        <FullPage>
          <h2>Sorry this organisation is not available</h2>
          <Button shape='round'><Link href='/orgs'><a>
            <FormattedMessage id='showOrgs' defaultMessage='Show All' description='Button to show all organisations' />
          </a></Link></Button>
          <Button shape='round'><Link href='/org/new'><a>
            <FormattedMessage id='newOrg' defaultMessage='New Organisation' description='Button to create a new organisation' />
          </a></Link></Button>
        </FullPage>
    }
    return (content)
  };
}

export default publicPage(withOrgs(OrgDetailPage))
