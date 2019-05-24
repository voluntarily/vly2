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

export class OpDetailPage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Op
    // console.log('getting op details', query)
    try {
      const ops = await store.dispatch(reduxApi.actions.opportunities.get(query))
      // console.log('got ops for id', query, ops)
      return { ops, query }
    } catch (err) {
      // console.log('error in getting ops', err)
    }
  }

  // Called when the user confirms they want to delete an op
  async handleDelete (op) {
    if (!op) return
    // Actual data request
    await this.props.dispatch(reduxApi.actions.opportunities.delete({ id: op._id }))
    // TODO error handling - how can this fail?
    message.success('Deleted. ')
    Router.replace(`/ops`)
  }

  // Called when the user starts to delete an op, but then cancels it.
  handleDeleteCancelled = () => { message.error('Delete Cancelled') }

  // Called when the user registers interest in an op
  handleRegisterInterest (op) {

  }

  render () {
    let content
    if (this.props.ops && this.props.ops.length === 1) {
      const op = this.props.ops[0]
      content =
        (<div>
          <OpDetail op={op} />

          <Divider />

          {/* These components should only appear if a user is logged in and viewing an op they did NOT create themselves.
              Note: Currently hardcoded Andrew W's id for "me".
            */}
          <div>
            <RegisterInterestSection op={op._id} me='5ccbe4c26c285b7184bff574' />
            <Divider />
          </div>

          {/* These components should only appear if a user is logged in and viewing an op they DID create themselves. */}
          <div>
            <Link href={`/ops/${op._id}/edit`} >
              <Button type='secondary' shape='round' >
                <FormattedMessage id='editOp' defaultMessage='Edit' description='Button to edit an opportunity on OpDetails page' />
              </Button>
            </Link>
            &nbsp;
            <Popconfirm title='Confirm removal of this opportunity.' onConfirm={this.handleDeleteOp} onCancel={this.cancel} okText='Yes' cancelText='No'>
              <Button type='danger' shape='round' >
                <FormattedMessage id='deleteOp' defaultMessage='Remove Request' description='Button to remove an opportunity on OpDetails page' />
              </Button>
            </Popconfirm>
            <Divider />
          </div>

          {/* Remove this message when appropriate. */}
          <div>
            <small>visible buttons here depend on user role</small>
          </div>

          {/* These components should only appear if a user is logged in and viewing an op they DID create themselves. */}
          <div>
            <h2>Interested Volunteers</h2>
            <InterestSection op={op._id} />
          </div>
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
