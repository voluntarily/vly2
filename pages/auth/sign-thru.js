import { authorize } from '../../lib/auth/auth0'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { unsetToken } from '../../lib/auth/auth'

export const SignThru = () => {
  const router = useRouter()
  const redirectUrl = router.query.redirect || '/home'

  useEffect(() => {
    unsetToken()
    authorize({ redirectUrl })
  }, [redirectUrl])

  return null
}

export default SignThru
