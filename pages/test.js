import Link from 'next/link'
import Head from 'next/head'
import publicPage, { A4 } from '../hocs/publicPage'
import Hello from '../components/test/Hello'
import LessStyled from '../components/test/LessStyled'
import AntdType from '../components/test/AntdType'
import IntlDemo from '../components/test/IntlDemo'
import OrgCard from '../components/Org/OrgCard'
import OrgDetail from '../components/Org/OrgDetail'
import RoutePush, { RouteBack, RouteReplace } from '../components/test/RoutePush'
const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbLLySM6USjl8xKaZJXdvTD08jW9jphCLSNXUW-kVDmPb7j8wC',
  about: 'OMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them',
  type: ['ap']
}

const UserProp = ({ loggedUser }) =>
  <ul>
    <li>nickname: {loggedUser.nickname}</li>
    <li>name: {loggedUser.name}</li>
    <li>picture: <img src={loggedUser.picture} /></li>
    <li>updated_at: {loggedUser.updated_at}</li>
    <li>email: {loggedUser.email}</li>
  </ul>

const TestPage = ({ ...props }) =>
  <A4>
    <Head><title>Voluntari.ly Tests</title></Head>
    <h1>Tests</h1>
    <Hello />
    <IntlDemo />
    <LessStyled />
    <h1>Test Router Actions</h1>
    <RoutePush href='/'>Home </RoutePush>
    <RoutePush href='/about'>About Page </RoutePush>
    <RouteReplace href='/orgs'>Replace Orgs </RouteReplace>
    <RouteBack href='/about'>Back</RouteBack>
    <Link href='/test-redirect'><a>Test Redirect to About</a></Link>
    <h1>Authenticated User Properties</h1>
    {props.isAuthenticated ? <UserProp {...props} /> : <p>Not signed in</p>}
    <AntdType />
    <h1>Organisation Card</h1>
    <OrgCard style={{ width: '300px' }} org={org} />
    <h1>Organisation Detail</h1>
    <OrgDetail org={org} />
  </A4>

export default publicPage((TestPage))
