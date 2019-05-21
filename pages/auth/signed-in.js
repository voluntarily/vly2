import React from 'react'
import Router from 'next/router'
import publicPage from '../../hocs/publicPage'
import Loading from '../../components/Loading'
import { setToken } from '../../lib/auth/auth'
import { parseHash } from '../../lib/auth/auth0'

class SignedIn extends React.Component {
  // TODO save the redirect url.
  // static propTypes = {
  //   url: PropTypes.object.isRequired
  // }
  // TODO Verify Token
  // verifyToken(result.idToken).then(valid => {
  //   if (valid) {
  //     saveToken(result.idToken, result.accessToken);
  //     Router.push('/');
  //   } else {
  //     Router.push('/')
  //   }
  // });

  componentDidMount () {
  // static async getInitialProps (ctx) {
    parseHash((err, result) => {
      if (err) {
        console.error('Something happened with the Sign In request')
        return
      }
      setToken(result.idToken, result.accessToken)
      // console.log('signed in.')
      Router.push(`/`)
    })
  }

  render = () => {
    return <Loading />
  }
}

export default publicPage(SignedIn)
