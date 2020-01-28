import { useEffect } from 'react'
import Router from 'next/router'
import { setToken } from '../../lib/auth/auth'
import { parseHash } from '../../lib/auth/auth0'

const SignedIn = () => {
  useEffect(() => {
    parseHash(async (err, result) => {
      if (!result) return
      if (err) {
        console.error('Something happened with the Sign In request')
        return
      }
      console.log('SignedIn', result, Router.router.query.r)
      setToken(result.idToken, result.accessToken)
      window.location.replace(Router.router.query.r)
    })
  }, [])

  return ''
}

export default SignedIn
