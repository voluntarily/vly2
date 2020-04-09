import Privacy from '../../assets/notices/privacy-en.md'
import { A5 } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import { AcceptAndContinueButton } from '../../components/VTheme/Buttons'
import { useRouter } from 'next/router'
import { authorize } from '../../lib/auth/auth0'

export const PresignAccept = () => {
  const router = useRouter()
  const { then } = router.query
  const handleAccept = () => {
    authorize({ redirectUrl: then, screen_hint: 'signup' })
  }
  return (
    <A5>
      <Privacy />
      <AcceptAndContinueButton onClick={handleAccept} />
    </A5>
  )
}
export default publicPage(PresignAccept)
