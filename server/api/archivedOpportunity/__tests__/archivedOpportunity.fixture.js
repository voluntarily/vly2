const { OpportunityStatus, OpportunityType } = require('../../opportunity/opportunity.constants')
const { regions } = require('../../location/locationData')

const OpList = [
  {
    type: OpportunityType.ASK,
    name: 'a Teach a year 5 business Impact Project',
    subtitle: 'Please Help us create a programme connecting business with senior students',
    imgUrl: 'https://www.tvnz.co.nz/content/dam/images/news/2015/01/26/pacific-island-mentors-with-kelston-high-school-students.jpg.hashed.0d58ef7e.desktop.story.share.jpg',
    description: 'We want to set up our Connect Ed programme, help us understand how to communication with businesses, build a website and contact group etc.',
    duration: '1 week, 1 hour sessions',
    location: regions[0].name,
    address: null,
    status: OpportunityStatus.COMPLETED,
    tags: [],
    date: [
      '2015-07-30T09:00:00.000Z',
      '2015-07-30T16:00:00.000Z'
    ],
    offerOrg: null,
    requestor: null,
    fromActivity: null
  },
  {
    type: OpportunityType.ASK,
    name: 'b Self driving destructive cars',
    subtitle: 'using algorithms to follow lines and avoid obstacles',
    imgUrl: 'http://www.plaz-tech.com/wp-content/plugins/wp-easycart-data/products/pics1/Arduino%20Car%202_8ab5dd38f1e3f6f05ad244f1e5e74529.jpg',
    description: '# NZTA Innovation Centre\n \n We have 6 model cars with sensors for vision, proximity etc, \n controlled by Arduinos teach them to solve \n 4 challenges - move, follow a line, avoid obstacles, \n get to a destination etc. \n \n ## We need:\n * Open space with room for the test tracks - e.g a school hall\n * teams of 5 students\n * on adult helper per team, should be able to follow instructions and understand a little C++\n \n ## Learning outcomes:\n * programming a remote device\n * simple coding\n * algorithmic thinking\n * problem solving.\n \n',
    duration: '55 hours',
    location: regions[0].containedTerritories[1],
    address: null,
    status: OpportunityStatus.COMPLETED,
    tags: [],
    date: [
      '2025-07-30T09:00:00.000Z',
      '2012-07-30T16:00:00.000Z'
    ],
    offerOrg: null,
    requestor: null,
    fromActivity: null
  },
  {
    type: OpportunityType.ASK,
    name: 'c Reducing plants in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://c.pxhere.com/photos/84/ac/garden_water_sprinkler_soil_lettuce_grow_agriculture_floral-561591.jpg!d',
    description: 'Project to destroy something in the garden',
    duration: '6 hours',
    location: regions[0].containedTerritories[1],
    address: null,
    status: OpportunityStatus.COMPLETED,
    tags: [],
    date: [
      '2020-01-30T09:00:00.000Z',
      '2017-01-30T22:00:00.000Z'
    ],
    offerOrg: null,
    requestor: null,
    fromActivity: null
  },
  {
    type: OpportunityType.ASK,
    name: 'd The second 500 metres',
    subtitle: 'Launching into nowhere',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: regions[0].containedTerritories[2],
    address: null,
    status: OpportunityStatus.CANCELLED,
    tags: [],
    date: [
      null,
      '2010-01-30T22:00:00.000Z'
    ],
    offerOrg: null,
    requestor: null,
    fromActivity: null
  },
  {
    type: OpportunityType.ASK,
    name: 'e How to travel to the sun',
    subtitle: 'Travelling up',
    imgUrl: 'https://images.sunlive.co.nz/images/170705-st-marys-school-rockets1.jpg',
    description: 'Attempting to go where no man has gone before',
    duration: '2 days',
    location: regions[2].name,
    address: null,
    status: OpportunityStatus.CANCELLED,
    tags: [],
    date: [
      null,
      null
    ],
    offerOrg: null,
    requestor: null,
    fromActivity: null
  }
]

module.exports = OpList
