import React from 'react'

import publicPage from '../../hocs/publicPage'
import { authorize } from '../../lib/auth/auth0'

class SignIn extends React.Component {
  componentDidMount () {
    authorize()
  }
  render () {
    return null
  }
}

export default publicPage(SignIn)
