const { OpportunityStatus } = require('../opportunity.constants')
const { regions } = require('../../location/locationData')

const opList = [
  {
    name: '1 Mentor a year 12 business Impact Project',
    subtitle: 'Help us create a programme connecting business with senior students',
    imgUrl: 'https://www.tvnz.co.nz/content/dam/images/news/2015/01/26/pacific-island-mentors-with-kelston-high-school-students.jpg.hashed.0d58ef7e.desktop.story.share.jpg',
    description: 'We want to set up our Connect Ed programme, help us understand how to communication with businesses, build a website and contact group etc.',
    duration: '12 weeks, 1 hour sessions',
    location: regions[0].name,
    status: OpportunityStatus.ACTIVE,
    tags: [],
    date: [
      null,
      null
    ]
  },
  {
    name: '2 Self driving model cars',
    subtitle: 'using algorithms to follow lines and avoid obstacles',
    imgUrl: 'http://www.plaz-tech.com/wp-content/plugins/wp-easycart-data/products/pics1/Arduino%20Car%202_8ab5dd38f1e3f6f05ad244f1e5e74529.jpg',
    description: '# NZTA Innovation Centre\n \n We have 6 model cars with sensors for vision, proximity etc, \n controlled by Arduinos teach them to solve \n 4 challenges - move, follow a line, avoid obstacles, \n get to a destination etc. \n \n ## We need:\n * Open space with room for the test tracks - e.g a school hall\n * teams of 5 students\n * on adult helper per team, should be able to follow instructions and understand a little C++\n \n ## Learning outcomes:\n * programming a remote device\n * simple coding\n * algorithmic thinking\n * problem solving.\n \n',
    duration: '4 hours',
    location: regions[0].containedTerritories[1],
    status: OpportunityStatus.ACTIVE,
    tags: [],
    date: [
      '2019-07-30T09:00:00.000Z',
      '2019-07-30T16:00:00.000Z'
    ]
  },
  {
    name: '3 Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://c.pxhere.com/photos/84/ac/garden_water_sprinkler_soil_lettuce_grow_agriculture_floral-561591.jpg!d',
    description: 'Project to grow something in the garden',
    duration: '6 hours',
    location: regions[0].containedTerritories[1],
    status: OpportunityStatus.DRAFT,
    tags: [],
    date: [
      '2020-07-30T09:00:00.000Z',
      null
    ]
  },
  {
    name: '4 The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: regions[0].containedTerritories[2],
    status: OpportunityStatus.DRAFT,
    tags: [],
    date: [
      null,
      null
    ]
  },
  {
    name: '5 Going to the moon',
    subtitle: 'Travelling up',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Attempting to go where no man has gone before',
    duration: '2 days',
    location: regions[2].name,
    status: OpportunityStatus.DRAFT,
    tags: [],
    date: [
      null,
      null
    ]
  },
  {
    name: '6 Building a race car',
    subtitle: 'Racecar',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Attempting to go where no man has gone before',
    duration: '2000 days',
    location: regions[2].name,
    status: OpportunityStatus.COMPLETED,
    tags: [],
    date: [
      null,
      null
    ]
  }
]

module.exports = opList
