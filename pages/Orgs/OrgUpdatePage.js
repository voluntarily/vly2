import { Component } from 'react'
import Layout from '../../components/Layout'
import reduxApi, { withOrgs } from '../../redux/reduxApi.js'
import { FormattedMessage } from 'react-intl'
import OrgDetailForm from '../../components/Org/OrgDetailForm'
import { message } from 'antd'
import Router from 'next/router'

class OrgUpdatePage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Org
    if (query !== 'new') {
      const orgs = await store.dispatch(reduxApi.actions.organisations.get(query))
      return { orgs, query }
    } else {
      return {
        orgs: [ { org: { name: '', type: 'vp', about: '', imgUrl: '' } } ],
        query
      }
    }
  }

  handleCancel = (org) => {
    Router.back()
  }

  handleAdd (org) {
    if (!org) return
    const callbackWhenDone = () => {
      message.success('Saved. ')
      // go  to details page
      Router.push(`/orgs/${org._id}`)
    }
    // Actual data request
    if (org._id) { // update put
      this.props.dispatch(reduxApi.actions.organisations.put({ id: org._id }, { body: JSON.stringify(org) }, callbackWhenDone))
    } else { // new post
      this.props.dispatch(reduxApi.actions.organisations.post({}, { body: JSON.stringify(org) }, callbackWhenDone))
    }
  }

  render () {
    const org = this.props.orgs[0]
    return (
      <Layout className='fullpage'>
        <h1><FormattedMessage
          defaultMessage='Organisation'
          id='OrganisationTitle' />
        </h1>
        <small><FormattedMessage
          defaultMessage='Tell us something about your organisation and link to your home website.'
          id='OrgEditPrompt' />
        </small>
        <OrgDetailForm org={org} onSubmit={this.handleAdd.bind(this, org)} onCancel={this.handleCancel} />
      </Layout>
    )
  };
}

export default withOrgs(OrgUpdatePage)
