
import publicPage, { FullPage } from '../hocs/publicPage'
import { Spacer } from  '../components/VTheme/VTheme'
import BigSearch from '../components/VTheme/BigSearch'
import TitleSection from '../components/HeroPage/TitleSection';
import OpListSection from '../components/Op/OpListSection';
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
  moniker: 'Testy',
  about: '30+ years in software development, product management, systems design and team leadership across a range of industries including science, technology, engineering, health, automotive, transport, mobile phone, and travel. I have a strong balance of technical and management skills.\n\nI have run my own company and led a start-up mobile phone company software team through a high growth period. I have created and developed multiple agile cross functional teams, managed DevOps processes and modernised IT platforms including migration to cloud services.\n\nI have a track record as a forward-thinking, customer focussed, innovative solutions designer and product development manager taking ideas from conception through implementation and delivery and into operation through a full business-process-aligned life cycle, managing teams using agile methodologies, leading-edge tools and technologies. ',
  email: 'testy@voluntar.ly',
  phone: '027 444 5555',
  gender: 'rather not say',
  avatar: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
  role: ['tester', 'volunteer'],
  status: 'active'
}

const UserProp = ({ loggedUser }) =>
  <ul>
    <li>nickname: {loggedUser.nickname}</li>
    <li>name: {loggedUser.name}</li>
    <li>picture: <img src={loggedUser.picture} /></li>
    <li>updated_at: {loggedUser.updated_at}</li>
    <li>email: {loggedUser.email}</li>
  </ul>

const TestPageTwo = ({ ...props }) =>
  <FullPage>
    <TitleSection title="Search results for Potatoes" />
    <BigSearch />
    <Spacer>

    </Spacer>
    <OpListSection />

  </FullPage>


export default publicPage((TestPageTwo))
