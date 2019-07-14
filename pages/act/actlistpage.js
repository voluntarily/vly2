import React, { Component } from 'react'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'
import reduxApi, { withActs } from '../../lib/redux/reduxApi.js'
import PropTypes from 'prop-types'
import ActList from '../../components/Act/ActList'
import ActMenu from '../../components/Act/ActMenu'

class Acts extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all Acts
    try {
      const acts = await store.dispatch(reduxApi.actions.activities.get())
      // console.log('got acts',acts)
      return { acts, query }
    } catch (err) {
      console.log('error in getting acts', err)
    }
  }

  render () {
    return (
      <FullPage>
        <h1>
          <FormattedMessage
            id='activities'
            defaultMessage='Activities'
            description='Title of page listing activities'
          />
        </h1>
        <Button shape='round'><Link href='/act/new'><a>
          <FormattedMessage id='act.new' defaultMessage='New Activity' description='Button to create a new activity' />
        </a></Link></Button>
        <br /><br />
        <ActMenu />
        {/* <ActList acts={this.props.acts} /> */}
      </FullPage>
    )
  }
}

Acts.propTypes = {
  acts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })).isRequired
  //  showAddAct: PropTypes.bool.isRequired,
  // dispatch: PropTypes.func.isRequired
}

Acts.contextTypes = {
  router: PropTypes.object
}

export default publicPage(withActs(Acts))
