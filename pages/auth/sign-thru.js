import { authorize } from '../../lib/auth/auth0'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const SignThru = () => {
  const router = useRouter()
  const redirectUrl = router.query.redirect || '/home'
  useEffect(() => {
    authorize({ redirectUrl })
  }, [])

  return null
}

export default SignThru
