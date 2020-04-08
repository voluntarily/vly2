import Privacy from '../../assets/notices/privacy-en.md'
import { A5 } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import { AcceptAndContinueButton } from '../../components/VTheme/Buttons'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const PresignAccept = () => {
  const router = useRouter()
  const { then } = router.query
  return (
    <A5>
      <Privacy />
      <Link href={then}>
        <AcceptAndContinueButton />
      </Link>
    </A5>
  )
}
export default publicPage(PresignAccept)
