import { Component } from 'react'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Button, Popconfirm, message } from 'antd'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import publicPage, { FullPage } from '../../hocs/publicPage'
import Router from 'next/router'
import OpDetail from '../../components/Op/OpDetail'
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

  async handleDelete (op) {
    if (!op) return
    // Actual data request
    await this.props.dispatch(reduxApi.actions.opportunities.delete({ id: op._id }))
    // TODO error handling - how can this fail?
    message.success('Deleted. ')
    Router.replace(`/ops`)
  }

  cancel = () => { message.error('Delete Cancelled') }

  render () {
    let content
    if (this.props.ops && this.props.ops.length === 1) {
      const op = this.props.ops[0]
      content =
        (<div>
          <OpDetail op={op} />
          {/* <Link to={`/ops/${op._id}/edit`} > */}
          <a href='mailto:interested@voluntari.ly'>
            <Button type='primary' shape='round' >
              <FormattedMessage id='claimOp' defaultMessage="I'm Interested" description='Button to show interest in an opportunity on OpDetails page' />
            </Button>
          </a>
          &nbsp;
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
          <br /><small>visible buttons here depend on user role</small>
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
