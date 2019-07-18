import { Button, message, Popconfirm } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Loading from '../../components/Loading'
import OrgDetail from '../../components/Org/OrgDetail'
import OrgDetailForm from '../../components/Org/OrgDetailForm'
import publicPage, { FullPage } from '../../hocs/publicPage'
import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'

const blankOrg = {
  name: '',
  about: '',
  imgUrl: '',
  contactEmail: '',
  contactId: null,
  website: null,
  type: ['vp']
}

class OrgDetailPage extends Component {
  state = {
    editing: false,
    text: ''
  }

  static async getInitialProps ({ store, query }) {
    // Get one Org
    const isNew = query && query.new && query.new === 'new'
    if (isNew) {
      // console.log('opdetailpage: getInitialProps', isNew)

      return {
        isNew: true,
        orgid: null
      }
    } else if (query && query.id) {
      await store.dispatch(reduxApi.actions.organisations.get(query))
      return {
        isNew: false,
        orgid: query.id
      }
    }
  }

  componentDidMount () {
    if (this.props.isNew) {
      this.setState({ editing: true })
    }
  }

  handleCancel = () => {
    this.setState({ editing: false })
    if (this.props.isNew) { // return to previous
      Router.back()
    }
  }

  async handleDelete (org) {
    if (!org) return
    // Actual data request
    await this.props.dispatch(reduxApi.actions.organisations.delete({ id: org._id }))
    // TODO: error handling - how can this fail?
    message.success('Deleted. ')
    Router.replace(`/orgs`)
  }

  async handleSubmit (org) {
    if (!org) return
    // Actual data request
    let res = {}
    if (org._id) {
      res = await this.props.dispatch(reduxApi.actions.organisations.put({ id: org._id }, { body: JSON.stringify(org) }))
    } else {
      res = await this.props.dispatch(reduxApi.actions.organisations.post({}, { body: JSON.stringify(org) }))
      org = res[0]
      Router.replace(`/orgs/${org._id}`)
    }
    this.setState({ editing: false })
    message.success('Saved.')
  }

  handleDeleteCancel = () => { message.error('Delete Cancelled') }

  render () {
    // TODO: [VP-274] identify if current person is an org Admin for this organisation
    const isOrgAdmin = false
    const isAdmin = (this.props.me && this.props.me.role.includes('admin'))
    const canEdit = (isOrgAdmin || isAdmin)
    const canRemove = isAdmin

    let content = ''
    let org = null
    if (this.props.organisations.loading) {
      content = <Loading><p>Loading details...</p></Loading>
    } else if (this.props.isNew) {
      org = blankOrg
    } else {
      const orgs = this.props.organisations.data
      if (orgs.length === 1) {
        org = orgs[0]
      }
    }

    if (!org) {
      content = <div>
        <h2>Sorry this organisation is not available</h2>
        <Button shape='round'>
          <Link href='/orgs'><a>
            <FormattedMessage id='showOrgs' defaultMessage='Show All' description='Button to show all organisations' />
          </a></Link>
        </Button>
        <Button shape='round'>
          <Link href='/org/new'><a>
            <FormattedMessage id='org.altnew' defaultMessage='New Organisation' description='Button to create a new organisation' />
          </a></Link>
        </Button>
      </div>
    } else {
      content = this.state.editing
        ? <div>
          <OrgDetailForm org={org} onSubmit={this.handleSubmit.bind(this, org)} onCancel={this.handleCancel.bind(this)} />
        </div>
        : <div>
          { canEdit && <Button style={{ float: 'right' }} type='primary' shape='round' onClick={() => this.setState({ editing: true })} >Edit</Button>}

          <OrgDetail org={org} />

          <Button shape='round'><Link href='/orgs'><a>
            <FormattedMessage id='showOrgs' defaultMessage='Show All' description='Button to show all organisations' />
          </a></Link></Button>
          { canRemove && <Popconfirm title='Confirm removal of this organisation.' onConfirm={this.handleDelete.bind(this, org)} onCancel={this.handleDeleteCancel.bind(this)} okText='Yes' cancelText='No'>
            <Button style={{ float: 'right' }} type='danger' shape='round' >
              <FormattedMessage id='deleteOrg' defaultMessage='Remove Organisation' description='Button to remove an Organisatino on OrgDetails page' />
            </Button>
          </Popconfirm> }
        </div>
    }
    return (
      <FullPage>
        {content}
      </FullPage>
    )
  };
}

export default publicPage(withOrgs(OrgDetailPage))
