import Link from 'next/link'
import Head from 'next/head'
import { Divider } from 'antd'
import publicPage from '../hocs/publicPage'
import { Hello, Greet } from '../components/examples/Hello'
import LessStyled from '../components/examples/LessStyled'
import AntdType from '../components/examples/AntdType'
import IntlDemo from '../components/examples/IntlDemo'
import OrgCard from '../components/Org/OrgCard'
import OrgDetail from '../components/Org/OrgDetail'
import PersonCard from '../components/Person/PersonCard'
import PersonDetail from '../components/Person/PersonDetail'
import RoutePush, { RouteBack, RouteReplace } from '../components/examples/RoutePush'
import ConfirmationCard from '../components/Interest/InterestConfirmationCard'
import Uploader from '../components/examples/Upload'
import { A4 } from '../VTheme/VTheme'

const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbLLySM6USjl8xKaZJXdvTD08jW9jphCLSNXUW-kVDmPb7j8wC',
  about: 'OMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them',
  type: ['ap']
}

const person = {
  _id: 'f34gb2bh24b24b2',
  name: 'Testy McTestface',
  nickname: 'Testy',
  about: '30+ years in software development, product management, systems design and team leadership across a range of industries including science, technology, engineering, health, automotive, transport, mobile phone, and travel. I have a strong balance of technical and management skills.\n\nI have run my own company and led a start-up mobile phone company software team through a high growth period. I have created and developed multiple agile cross functional teams, managed DevOps processes and modernised IT platforms including migration to cloud services.\n\nI have a track record as a forward-thinking, customer focussed, innovative solutions designer and product development manager taking ideas from conception through implementation and delivery and into operation through a full business-process-aligned life cycle, managing teams using agile methodologies, leading-edge tools and technologies. ',
  email: 'testy@voluntar.ly',
  phone: '027 444 5555',
  gender: 'rather not say',
  imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
  role: ['tester', 'volunteer'],
  status: 'active',
  title: 'Awesome Human at OMGTech',
  org: org
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
    <Head><title>Voluntarily Tests</title></Head>
    <h1>Tests</h1>
    <Greet />
    <Hello name='Andrew' surname='watkins' />
    <IntlDemo />
    <LessStyled />
    <Divider />
    <h1>Uploaders</h1>
    <Uploader />
    <Divider />

    <h1>Test Router Actions</h1>
    <RoutePush href='/'>Home </RoutePush>
    <RoutePush href='/about'>About Page </RoutePush>
    <RouteReplace href='/orgs'>Replace Orgs </RouteReplace>
    <RouteBack href='/about'>Back</RouteBack>
    <Link href='/examples-redirect'><a>Test Redirect to About</a></Link>
    <Divider />
    <h1>Authenticated User Properties</h1>
    {props.isAuthenticated ? <UserProp {...props} /> : <p>Not signed in</p>}
    <h1>Person Card</h1>
    <PersonCard style={{ width: '300px' }} person={props.isPerson ? props.me : person} />
    <ConfirmationCard organizer={person.org ? person : null} />
    <h1>Person Detail</h1>
    <PersonDetail person={props.isPerson ? props.me : person} />
    <Divider />
    <h1>Organisation Card</h1>
    <OrgCard style={{ width: '300px' }} org={org} />
    <h1>Organisation Detail</h1>
    <OrgDetail org={org} />
    <AntdType />
  </A4>

export default publicPage((TestPage))
