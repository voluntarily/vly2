import React from 'react'
import Router from 'next/router'
import publicPage from '../../hocs/publicPage'
import Loading from '../../components/Loading'
import { parseTokenToSession, setToken } from '../../lib/auth/auth'
import { parseHash } from '../../lib/auth/auth0'
import { connect } from 'react-redux'
import { setSession } from '../../lib/redux/actions'

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
    parseHash(async (err, result) => {
      if (!result) return
      if (err) {
        console.error('Something happened with the Sign In request')
        return
      }
      setToken(result.idToken, result.accessToken)
      const session = await parseTokenToSession(result.idToken)
      this.props.setSession(session)
      Router.push(Router.router.query.r)
    })
  }

  render = () => {
    return <Loading />
  }
}

export const SignedInTest = SignedIn
export default connect(
  null,
  { setSession }
)(publicPage(SignedIn))
