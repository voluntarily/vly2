import React from 'react'
import { unsetToken } from '../../lib/auth/auth'
import { logout } from '../../lib/auth/auth0'

export default class SignOff extends React.Component {
  componentDidMount () {
    unsetToken()
    logout()
  }
  render () {
    return null
  }
}
