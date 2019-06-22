import { Component } from 'react'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import OpDetailForm from '../../components/Op/OpDetailForm'
import publicPage, { FullPage } from '../../hocs/publicPage'
import { message } from 'antd'
import Router from 'next/router'
import moment from 'moment'
import PropTypes from 'prop-types'

const newOp = {
  title: '',
  subtitle: '',
  imgUrl: '',
  duration: '',
  location: '',
  status: 'inactive'
}

export class OpUpdatePage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Op
    if (query && query.id) {
      const ops = await store.dispatch(reduxApi.actions.opportunities.get(query))
      // ops[0].date = ops[0].date.filter(element => moment(element, 'YYYY-MM-DD HH:mm:ss')) // Convert each of the element to moment type for date picker
      return { ops, query }
    } else {
      return {
        ops: [ { op: newOp } ],
        query
      }
    }
  }

  handleCancel = (op) => {
    Router.back()
  }

  async handleAdd (op) {
    if (!op) return
    // Actual data request
    let res = {}
    if (op._id) {
      res = await this.props.dispatch(reduxApi.actions.opportunities.put({ id: op._id }, { body: JSON.stringify(op) }))
    } else {
      res = await this.props.dispatch(reduxApi.actions.opportunities.post({}, { body: JSON.stringify(op) }))
    }
    op = res[0]
    message.success('Saved.')
    // go  to details page
    if (op && op._id) Router.push(`/ops/${op._id}`)
  }
  render () {
    const op = this.props.ops[0]
    const me = this.props.me
    return (
      <FullPage>
        <h1>Create a request</h1>
        <small>Ready to get some help? Lets start by letting volunteers know what you need</small>
        <OpDetailForm op={op} me={me} onSubmit={this.handleAdd.bind(this, op)} onCancel={this.handleCancel} />
        <br />
        {/* <Collapse>
          <Panel header="Debug" key="1">
            <pre>
              {JSON.stringify(this.props.op, null, 2)}
            </pre>
          </Panel>
        </Collapse> */}
      </FullPage>
    )
  }
}

OpUpdatePage.propTypes = {
  op: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    date: PropTypes.any,
    duration: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default publicPage(withOps(OpUpdatePage))
