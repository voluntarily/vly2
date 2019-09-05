import { Button } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import OpList from '../../components/Op/OpList'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'

class Ops extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all Ops
    try {
      const ops = await store.dispatch(reduxApi.actions.opportunities.get())
      // console.log('got ops', ops)
      return { ops, query }
    } catch (err) {
      console.log('error in getting ops', err)
    }
  }

  render () {
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Opportunities List</title>
        </Helmet>
        <h1>
          <FormattedMessage
            id='opportunities'
            defaultMessage='Opportunities'
            description='Title of page listing opportunities'
          />
        </h1>
        <Button shape='round'><Link href='/op/new'><a>
          <FormattedMessage id='op.new' defaultMessage='New Opportunity' description='Button to create a new opportunity' />
        </a></Link></Button>
        <br /><br />
        <OpList ops={this.props.ops} />
      </FullPage>
    )
  }
}

Ops.propTypes = {
  ops: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })).isRequired
  //  showAddOp: PropTypes.bool.isRequired,
  // dispatch: PropTypes.func.isRequired
}

Ops.contextTypes = {
  router: PropTypes.object
}

export default publicPage(withOps(Ops))
