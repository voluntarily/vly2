import { Component } from 'react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Button, Popconfirm, message, Divider } from 'antd'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import publicPage, { FullPage } from '../../hocs/publicPage'
import Router from 'next/router'
import OpDetail from '../../components/Op/OpDetail'
import InterestSection from '../../components/Interest/interestSection'
import RegisterInterestSection from '../../components/Interest/RegisterInterestSection'
import PropTypes from 'prop-types'
import PersonCard from '../../components/Person/PersonCard'

export class OpDetailPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Op
    // console.log('getting op details', query)
    try {
      await store.dispatch(reduxApi.actions.opportunities.get(query))
      // console.log('got ops for id', query, ops)
    } catch (err) {
      // console.log('error in getting ops', err)
    }
  }

  // Called when the user confirms they want to delete an op
  async handleDelete (op) {
    // console.log('deleting op', op)
    if (!op) return
    // Actual data request
    await this.props.dispatch(reduxApi.actions.opportunities.delete({ id: op._id }))
    // TODO error handling - how can this fail?
    message.success('Request Deleted. ')
    Router.replace(`/home`)
  }

  // Called when the user starts to delete an op, but then cancels it.
  handleDeleteCancelled = () => { message.error('Delete Cancelled') }

  render () {
    let content
    if (this.props.opportunities && this.props.opportunities.data.length === 1) {
      const op = this.props.opportunities.data[0]
      const organizer = op.requestor
      const isOwner = ((this.props.me || {})._id === (organizer || {})._id)
      // TODO add condition that when volunteer finished the comment then show organizer's contact
      let isFulfilled = true
      const organizerSection = () => {
        return (isFulfilled)
          ? organizer &&
          <div>
            <h2>
              <FormattedMessage id='organiser' defaultMessage='Requested by' description='Title for organiser card on op details page' />
            </h2>
            <PersonCard style={{ width: '300px' }} person={organizer} />
          </div>
          : null
      }
      const interestedSection = () => {
        return (
          !this.props.isAuthenticated
            ? <div>
              {/* TODO: [VP-176] Sign in to express interest in this item */}
              <Link href={`/auth/sign-in`} >
                <Button type='primary' shape='round' >
                  <FormattedMessage id='iminterested-anon' defaultMessage="I'm Interested" description="I'm interested button that leads to sign in page" />
                </Button>
              </Link>
              <Divider />
            </div>
            : !isOwner
              ? <div>
                <RegisterInterestSection op={op} me={this.props.me._id} />
                <Divider />
              </div>
              : ''
        )
      }
      const requestSection = () => {
        return (isOwner || (this.props.me && this.props.me.role.includes('admin')))
          ? <div>
            {/* These components should only appear if a user is logged in and viewing an op they DID create themselves. */}
            <div>
              <Link href={`/ops/${op._id}/edit`} >
                <Button type='primary' shape='round' >
                  <FormattedMessage id='editOp' defaultMessage='Edit' description='Button to edit an opportunity on OpDetails page' />
                </Button>
              </Link>
                &nbsp;
              <Popconfirm title='Confirm removal of this opportunity.' onConfirm={this.handleDelete.bind(this, op)} onCancel={this.handleDeleteCancelled} okText='Yes' cancelText='No'>
                <Button type='danger' shape='round' >
                  <FormattedMessage id='deleteOp' defaultMessage='Cancel Request' description='Button to remove an opportunity on OpDetails page' />
                </Button>
              </Popconfirm>
              <Divider />
            </div>

            {/* These components should only appear if a user is logged in and viewing an op they DID create themselves. */}
            <div>
              <h2>Interested Volunteers</h2>
              <InterestSection op={op._id} />
            </div>
          </div>
          : null
      }
      // TODO: [VP-161] In register interest section, if person not signed in show Sign In button
      content =
        (<div>
          <OpDetail op={op} />
          <Divider />
          {interestedSection()}
          {requestSection()}
          {organizerSection()}

        </div>)
    } else {
      content =
        (<div>
          <h2>Sorry this opportunity is no longer available</h2>
          <Link href={'/ops'} ><a>Search for some more</a></Link>
          <p>or </p>
          <Link href={'/ops/new'} ><a>create a new opportunity</a></Link>
        </div>)
    }
    return (<FullPage>{content}</FullPage>)
  }
}

OpDetailPage.propTypes = {
  op: PropTypes.shape({
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

export default publicPage(withOps(OpDetailPage))
