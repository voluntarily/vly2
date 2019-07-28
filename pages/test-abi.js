import OrgCard from '../components/Org/OrgCard'
import publicPage, { A4 } from '../hocs/publicPage'
import OrgCategory from '../components/Org/OrgCategory'

const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbLLySM6USjl8xKaZJXdvTD08jW9jphCLSNXUW-kVDmPb7j8wC',
  about: 'OMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them',
  category: ['ap', 'vp' ]
}

const mycat =  ['ap', 'vp', 'admin' ]
const TestPage = ({ ...props }) =>
  <A4>
    <h1>Organisation Card</h1>
    {/* <OrgCategory category={mycat}></OrgCategory> */}
    <OrgCard style={{ width: '300px' }} org={org} />
  </A4>

export default publicPage((TestPage))
