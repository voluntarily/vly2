// import Link from 'next/link'
import Head from 'next/head'
import publicPage, { FullPage } from '../../hocs/publicPage'
import InterestItem from '../../components/Interest/InterestItem'
import InterestTable from '../../components/Interest/InterestTable'
import InterestSection from '../../components/Interest/InterestSection'
import people from './testy.people'
import { Divider } from 'antd'

const opportunity = {
  _id: '5cc8d60b8b16812b5b392321',
  title: 'Self driving model cars ',
  subtitle: 'using algorithmns to follow lines and avoid obstacles',
  imgUrl:
    'http://www.plaz-tech.com/wp-content/plugins/wp-easycart-data/products/pics1/Arduino%20Car%202_8ab5dd38f1e3f6f05ad244f1e5e74529.jpg',
  description:
    '# NZTA Innovation Centre\n \n We have 6 model cars with sensors for vision, proximity etc, \n controlled by Arduinos teach them to solve \n 4 challenges - move, follow a line, avoid obstacles, \n get to a destination etc. \n \n ## We need:\n * Open space with room for the test tracks - e.g a school hall\n * teams of 5 students\n * on adult helper per team, should be able to follow instructions and understand a little C++\n \n ## Learning outcomes:\n * programming a remote device\n * simple coding\n * algorithmic thinking\n * problem solving.\n \n',

  duration: '4 hours',
  location: 'NZTA Innovation Centre, 5 Cook St Auckland',
  status: 'draft'
}
const opId = '5cc8d60b8b16812b5b3920c1'

// Initial interests added into test db
const interests = people.map(person => ({
  _id: person._id,
  person: {
    _id: person._id,
    name: person.name,
    email: person.email,
    nickname: person.nickname
  },
  opportunity: opportunity._id,
  comment: `${person.nickname} is interested call ${person.phone}`,
  status: 'interested'
}))

const TestInterestPage = ({ ...props }) => (
  <FullPage>
    <Head>
      <title>Voluntarily Test Interests</title>
    </Head>

    <h1>People Interested in a Specific Op </h1>
    <p>op = {opId}</p>
    <InterestSection op={opId} />
    <Divider />

    <h1>Single Interest Item</h1>
    <InterestItem style={{ width: '300px' }} interest={interests[0]} />
    <Divider />

    <h1>Longer Interest Table</h1>
    <InterestTable style={{ width: '300px' }} interests={interests} />
    {/* <code>{JSON.stringify(interests)}</code>  */}
  </FullPage>
)
export default publicPage(TestInterestPage)
