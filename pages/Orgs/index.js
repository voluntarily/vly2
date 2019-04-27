import { Component } from 'react'
import Layout from '../../components/Layout'
import reduxApi, { withOrgs } from '../../redux/reduxApi.js'
import { FormattedMessage } from 'react-intl'
import OrgList from '../../components/Org/OrgList'

class Orgs extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all Orgs
    const orgs = await store.dispatch(reduxApi.actions.organisations.sync())
    return { orgs, query }
  }

  handleAdd (event) {
    const { name } = this.state
    if (!name) return
    const callbackWhenDone = () => this.setState({ name: '', inProgress: false })
    this.setState({ inProgress: true })
    // Actual data request
    const neworg = { name }
    this.props.dispatch(reduxApi.actions.organisations.post({}, { body: JSON.stringify(neworg) }, callbackWhenDone))
  }

  handleUpdate (org, index, orgId, event) {
    const name = window.prompt('New name?', org.name)
    if (!name) return
    const callbackWhenDone = () => this.setState({ inProgress: false })
    this.setState({ inProgress: orgId })
    // Actual data request
    const neworg = { id: orgId, name }
    this.props.dispatch(reduxApi.actions.organisations.put({ id: orgId }, { body: JSON.stringify(neworg) }, callbackWhenDone))
  }

  handleDelete (index, orgId, event) {
    const callbackWhenDone = () => this.setState({ inProgress: false })
    this.setState({ inProgress: orgId })
    // Actual data request
    this.props.dispatch(reduxApi.actions.organisations.delete({ id: orgId }, callbackWhenDone))
  }

  render () {
    const { orgs } = this.props// dd
    console.log(orgs)
    return (
      <Layout className='cardlist'>
        <h1><FormattedMessage
          defaultMessage='Organisations'
          id='OrganisationsTitle' /></h1>

        <OrgList orgs={orgs} />
        <style jsx>{`
            .cardlist {
              margin: 3em;
              max-width: 50em;
            }
            @media (max-width: 600px) {
              .cardlist {
                margin: 0 3em;
              }
            }
          `}</style>
      </Layout>
    )
  };
}

export default withOrgs(Orgs)
