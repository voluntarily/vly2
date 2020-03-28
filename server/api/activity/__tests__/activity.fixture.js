import cuid from 'cuid'
import { OrganisationRole } from '../../organisation/organisation.constants'

const orgOmgTech = {
  _id: cuid(),
  name: 'OMGTech',
  slug: 'omgtech',
  role: [OrganisationRole.ACTIVITY_PROVIDER, OrganisationRole.VOLUNTEER_PROVIDER],
  imgUrl: 'https://www.tvnz.co.nz/content/dam/images/news/2015/01/26/pacific-island-mentors-with-kelston-high-school-students.jpg.hashed.0d58ef7e.desktop.story.share.jpg',
  info: {
    about: 'Awesome content providers'
  }
}
const orgActionWhizzyFelt = {
  _id: cuid(),
  name: 'Action Whizzy Felt',
  imgUrl: 'https://files.list.co.uk/images/2009/02/19/623atpiccap2.jpg'
}
const actList = [
  {
    name: "1 What's my line - Careers panel game",
    subtitle: 'Professionals talk about their work',
    imgUrl: 'https://www.tvnz.co.nz/content/dam/images/news/2015/01/26/pacific-island-mentors-with-kelston-high-school-students.jpg.hashed.0d58ef7e.desktop.story.share.jpg',
    description: 'We want to set up our Connect Ed programme, help us understand how to communication with businesses, build a website and contact group etc.',
    duration: '12 weeks, 1 hour sessions',
    status: 'active',
    offerOrg: orgOmgTech
  },
  {
    name: '2 Self driving model cars',
    subtitle: 'using algorithms to follow lines and avoid obstacles',
    imgUrl: 'http://www.plaz-tech.com/wp-content/plugins/wp-easycart-data/products/pics1/Arduino%20Car%202_8ab5dd38f1e3f6f05ad244f1e5e74529.jpg',
    description: '# NZTA Innovation Centre\n \n We have 6 model cars with sensors for vision, proximity etc, \n controlled by Arduinos teach them to solve \n 4 challenges - move, follow a line, avoid obstacles, \n get to a destination etc. \n \n ## We need:\n * Open space with room for the test tracks - e.g a school hall\n * teams of 5 students\n * on adult helper per team, should be able to follow instructions and understand a little C++\n \n ## Learning outcomes:\n * programming a remote device\n * simple coding\n * algorithmic thinking\n * problem solving.\n \n',
    duration: '4 hours',
    status: 'active',
    offerOrg: orgActionWhizzyFelt
  },
  {
    name: '5 Going to the moon',
    subtitle: 'Travelling up',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Attempting to go where no man has gone before',
    duration: '4 hours',
    status: 'active',
    offerOrg: orgActionWhizzyFelt
  },
  {
    name: '3 Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://c.pxhere.com/photos/84/ac/garden_water_sprinkler_soil_lettuce_grow_agriculture_floral-561591.jpg!d',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    equipment: ['item one', 'item two', 'item three'],
    status: 'draft'
  },
  {
    name: '4 The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    equipment: ['single item'],
    status: 'draft'
  }
]

module.exports = actList
