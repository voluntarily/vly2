import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import { setToken } from '../../lib/auth/auth'
import { parseHash } from '../../lib/auth/auth0'

export default class SignedIn extends React.Component {
  // static propTypes = {
  //   url: PropTypes.object.isRequired
  // }

  componentDidMount () {
    parseHash((err, result) => {
      if (err) {
        console.error('Something happened with the Sign In request')
        return
      }

      setToken(result.idToken, result.accessToken)
      console.log('signed in.')
      Router.replace('/')
    })
  }
  render () {
    return null
  }
}
