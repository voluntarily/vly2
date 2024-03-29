import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { authorize } from '../lib/auth/auth0'
import { unsetToken } from '../lib/auth/auth'

export { RouteGuard }

/** list all the public paths here,  by default pages require a signed in user. */
const publicPaths = [
  '/',
  '/about',
  '/auth/sign-thru',
  '/auth/signed-in',
  '/test/test-publicpage',
  '/_404',
  '/_error'

]

function RouteGuard ({ children }) {
  const router = useRouter()
  const [permitted, setPermitted] = useState(false)
  const [session] = useSelector(state => [state.session])
  useEffect(() => {
    // on initial load - run auth check
    function authCheck (targeturl) {
      // redirect to login page if accessing a private page and not logged in
      const path = targeturl.split('?')[0]
      if (!session.isAuthenticated && !publicPaths.includes(path)) {
        setPermitted(false)
        unsetToken()
        authorize({ redirectUrl: router.asPath })
        // router.push({
        //   pathname: '/auth/sign-thru',
        //   query: { redirect: router.asPath }
        // })
      } else {
        setPermitted(true)
      }
    }

    authCheck(router.asPath)

    // on route change start - hide page content by setting permitted to false
    const hideContent = () => setPermitted(false)
    router.events.on('routeChangeStart', hideContent)

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
    }
  }, [session.isAuthenticated, router])

  return (permitted && children)
}
