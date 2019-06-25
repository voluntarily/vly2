import { Component } from 'react'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import OpDetailForm from '../../components/Op/OpDetailForm'
import publicPage, { FullPage } from '../../hocs/publicPage'
import { message, Divider } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import PageTitle from '../../components/LandingPageComponents/PageTitle.js';
const newOp = {
  title: '',
  subtitle: '',
  imgUrl: '',
  duration: '',
  location: '',
  status: 'inactive'
}

const TitleContainer = styled.div`
margin-top:5rem;
margin-bottom: 5rem;
`

export class OpUpdatePage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Op
    if (query && query.id) {
      const ops = await store.dispatch(reduxApi.actions.opportunities.get(query))
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
<PageTitle
title='Create a request'
subtitle='Ask volunteers for assistance with anything related to tech - there are 1,312 volunteers looking for opportunities to help out'
/>
<Divider />
        
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
    duration: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default publicPage(withOps(OpUpdatePage))
