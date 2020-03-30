import objectid from 'objectid'
import { OrganisationRole } from '../../../server/api/organisation/organisation.constants'

const requestor = {
  _id: objectid().toString(),
  name: 'Testy McTestface',
  imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png'
}
export const orgActionWhizzyFelt = {
  _id: objectid().toString(),
  name: 'Action Whizzy Felt',
  imgUrl: 'https://files.list.co.uk/images/2009/02/19/623atpiccap2.jpg'
}
export const orgOmgTech = {
  _id: objectid().toString(),
  name: 'OMGTech',
  slug: 'omgtech',
  role: [OrganisationRole.ACTIVITY_PROVIDER, OrganisationRole.VOLUNTEER_PROVIDER],
  imgUrl: 'https://images.squarespace-cdn.com/content/556e9677e4b099ded4a2e757/1488844920526-ZGL78IXEPYARVWLL778H/OMGTECH.png?content-type=image%2Fpng',
  info: {
    about: 'Awesome content providers'
  }
}
const noDate = []
const openDate = [
  '2019-05-23T12:26:18.000Z' // Fri, 24 May 2019 00:26:18 NZST
]
const date = [
  '2019-05-23T12:26:18.000Z', // Fri, 24 May 2019 00:26:18 NZST
  '2019-06-12T04:55:10.014Z' // Wed, 12 Jun 2019 16:55:10 NZST
]

export default [
  {
    _id: objectid().toString(),
    type: 'ask',
    name: '1 Mentor a year 12 business Impact Project',
    subtitle: 'Help us create a programme connecting business with senior students',
    imgUrl: 'https://www.tvnz.co.nz/content/dam/images/news/2015/01/26/pacific-island-mentors-with-kelston-high-school-students.jpg.hashed.0d58ef7e.desktop.story.share.jpg',
    description: 'We want to set up our Connect Ed programme, help us understand how to communication with businesses, build a website and contact group etc.',
    duration: '12 weeks, 1 hour sessions',
    location: 'Wellington',
    status: 'active',
    requestor,
    offerOrg: orgActionWhizzyFelt,
    tags: [],
    date: noDate
  },
  {
    _id: objectid().toString(),
    type: 'ask',
    name: '2 Self driving model cars',
    subtitle: 'using algorithms to follow lines and avoid obstacles',
    imgUrl: 'http://www.plaz-tech.com/wp-content/plugins/wp-easycart-data/products/pics1/Arduino%20Car%202_8ab5dd38f1e3f6f05ad244f1e5e74529.jpg',
    description: '# NZTA Innovation Centre\n \n We have 6 model cars with sensors for vision, proximity etc, \n controlled by Arduinos teach them to solve \n 4 challenges - move, follow a line, avoid obstacles, \n get to a destination etc. \n \n ## We need:\n * Open space with room for the test tracks - e.g a school hall\n * teams of 5 students\n * on adult helper per team, should be able to follow instructions and understand a little C++\n \n ## Learning outcomes:\n * programming a remote device\n * simple coding\n * algorithmic thinking\n * problem solving.\n \n',
    duration: '4 hours',
    location: 'Ruakaka',
    status: 'active',
    requestor,
    offerOrg: orgOmgTech,
    tags: [],
    date: openDate
  },
  {
    _id: objectid().toString(),
    type: 'ask',
    name: '3 Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://c.pxhere.com/photos/84/ac/garden_water_sprinkler_soil_lettuce_grow_agriculture_floral-561591.jpg!d',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Auckland',
    status: 'active',
    requestor,
    offerOrg: orgActionWhizzyFelt,
    interest: { status: 'interested' },
    tags: [],
    date
  },
  {
    _id: objectid().toString(),
    type: 'ask',
    name: '4 The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '',
    location: 'Hamilton',
    // this has no requestor
    offerOrg: orgActionWhizzyFelt,
    status: 'active',
    tags: [],
    date
  },
  {
    _id: objectid().toString(),
    type: 'ask',
    name: '5 Going to the moon',
    subtitle: 'Travelling up',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Attempting to go where no man has gone before',
    duration: '',
    location: 'Auckland',
    requestor,
    // this one has no offerOrg
    status: 'active',
    tags: [],
    date
  }
]
