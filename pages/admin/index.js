import Link from 'next/link'
import { FullPage } from '../../components/VTheme/VTheme'
import adminPage from '../../hocs/adminPage'

export const AdminPage = () =>
  <FullPage>
    <h1>Administration Tools</h1>
    <ul>
      <li>
        <Link href='/admin/invite-school'>
          <a>Send invitation to new school</a>
        </Link>
      </li>
      <li>
        <Link href='/admin/goals'>
          <a>Goal Cards</a>
        </Link>
      </li>
      <li>
        <Link href='/admin/test'>
          <a>E2E Testing Launcher</a>
        </Link>
      </li>
    </ul>

  </FullPage>

export default adminPage(AdminPage)
