import React, { Component } from 'react'
// [@TODO] - remove Input once actual search component is done
import { Button, Input } from 'antd'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import publicPage, { FullPage } from '../../hocs/publicPage'
import reduxApi, { withActs } from '../../lib/redux/reduxApi.js'
import PropTypes from 'prop-types'
import ActList from '../../components/Act/ActList'
import ActMenu from '../../components/Act/ActMenu'
import NoResult from './actnoresult'
import Router from 'next/router'
const escapeRegex = require('../../server/util/regexUtil')

class Acts extends Component {
  static async getInitialProps ({ store, query }) {
    // Get all Acts
    try {
      const acts = await store.dispatch(reduxApi.actions.activities.get({
        ...query
      }))
      // console.log('got acts',acts)
      return { acts, query }
    } catch (err) {
      console.log('error in getting acts', err)
    }
  }

  handleSearch (value) {
    value = escapeRegex(value)
    if (!value) {
      return false
    }
    Router.push({
      pathname: '/acts',
      query: {
        search: value
      }
    })
  }

  render () {
    const { acts } = this.props
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
        {/* [@TODO] Replace with actual searchbar component */}
        <Input.Search
          placeholder='eg: activity'
          enterButton='Search'
          size='large'
          onSearch={this.handleSearch}
        />
        {acts.length > 0 ? (
          <ActList
            acts={acts}
          />
        ) : (
          <NoResult />
        )}
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
