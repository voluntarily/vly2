import { Component } from 'react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Button, Popconfirm, message, Divider } from 'antd'
import reduxApi, { withActs } from '../../lib/redux/reduxApi.js'
import publicPage, { FullPage } from '../../hocs/publicPage'
import Router from 'next/router'
import ActDetail from '../../components/Act/ActDetail'
import PropTypes from 'prop-types'
import PersonCard from '../../components/Person/PersonCard'

export class ActDetailPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Act
    // console.log('getting act details', query)
    try {
      await store.dispatch(reduxApi.actions.activities.get(query))
      // console.log('got acts for id', query, acts)
    } catch (err) {
      // console.log('error in getting acts', err)
    }
  }

  // Called when the user confirms they want to delete an act
  async handleDelete (act) {
    if (!act) return
    // Actual data request
    await this.props.dispatch(reduxApi.actions.activities.delete({ id: act._id }))
    // TODO error handling - how can this fail?
    message.success('Deleted. ')
    Router.replace(`/acts`)
  }

  // Called when the user starts to delete an act, but then cancels it.
  handleDeleteCancelled = () => { message.error('Delete Cancelled') }

  render () {
    let content
    if (this.props.activities && this.props.activities.data.length === 1) {
      const act = this.props.activities.data[0]
      const activityProvider = act.owner
      const isOwner = ((this.props.me || {})._id === (activityProvider || {})._id)
      // TODO add condition that when volunteer finished the comment then show activityProvider's contact
      let isFulfilled = true
      const activityProviderSection = () => {
        return (isFulfilled)
          ? activityProvider &&
          <div>
            <h2>
              <FormattedMessage id='act.details.owner' defaultMessage='Contact' description='Contact details for Activity provider' />
            </h2>
            <PersonCard style={{ width: '300px' }} person={activityProvider} />
          </div>
          : null
      }
      const ownerSection = () => {
        return (isOwner || (this.props.me && this.props.me.role.includes('admin')))
          ? <div>
            {/* These components should only appear if a user is logged in and viewing an op they DID create themselves. */}
            <div>
              <Link href={`/acts/${act._id}/edit`} >
                <Button type='secondary' shape='round' >
                  <FormattedMessage id='editAct' defaultMessage='Edit' description='Button to edit an activity on ActDetails page' />
                </Button>
              </Link>
                &nbsp;
              <Popconfirm title='Confirm removal of this activity.' onConfirm={this.handleDeleteOp} onCancel={this.handleDeleteCancelled} okText='Yes' cancelText='No'>
                <Button type='danger' shape='round' >
                  <FormattedMessage id='deleteAct' defaultMessage='Remove Activity' description='Button to remove an activity on ActDetails page' />
                </Button>
              </Popconfirm>
              <Divider />
            </div>
          </div>
          : null
      }
      // TODO: [VP-161] In register interest section, if person not signed in show Sign In button
      content =
        (<div>
          <ActDetail act={act} />
          <Divider />
          {ownerSection()}
          {activityProviderSection()}

        </div>)
    } else {
      content =
        (<div>
          <h2>Sorry this activity is no longer available</h2>
          <Link href={'/acts'} ><a>Search for some more</a></Link>
          <p>or </p>
          <Link href={'/acts/new'} ><a>create a new activity</a></Link>
        </div>)
    }
    return (<FullPage>{content}</FullPage>)
  }
}

ActDetailPage.propTypes = {
  act: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string.isRequired
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default publicPage(withActs(ActDetailPage))
