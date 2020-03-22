import React from 'react'
import { unsetToken } from '../../lib/auth/auth'
import { logout } from '../../lib/auth/auth0'
import Router from 'next/router'

export default class SignOff extends React.Component {
  componentDidMount () {
    unsetToken()
    logout()
    Router.push('/')
  }

  render () {
    return null
  }
}
