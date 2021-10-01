import objectid from 'objectid'
import { OrganisationRole } from '../../../server/api/organisation/organisation.constants'

export default [
  {
    _id: objectid().toString(),
    createdAt: '2019-04-28T19:03:39.908Z',
    name: 'Voluntarily NZ',
    slug: 'voluntarily-nz',
    info: {
      about: '<h1><strong>Industry in the classroom.</strong></h1><p>We are building a platform that connects corporate volunteer time with classrooms to teach science, technology, engineering, entrepreneurship, arts and design with the help of engaging content supplied by New Zealand’s leading innovators in educational content.</p><p><br></p><p>Super</p>',
      members: '<h1><strong>You are a member of Voluntarily. </strong></h1>',
      followers: '<h1><strong>You are a follower of Voluntarily. </strong></h1>',
      joiners: '<h1><strong>You are a nearly a member of Voluntarily. </strong></h1>',
      outsiders: '<h1><strong>You could be a member of Voluntarily. </strong></h1>'
    },
    imgUrl: 'http://localhost:3122/static/vlogo.svg',
    role: [
      OrganisationRole.VOLUNTEER_PROVIDER,
      OrganisationRole.OPPORTUNITY_PROVIDER,
      OrganisationRole.ACTIVITY_PROVIDER,
      OrganisationRole.ADMIN,
      'other'
    ],
    contactEmail: 'andrew@voluntarily.nz',
    contactPhoneNumber: '555 1234567',
    website: 'https://voluntarily.nz',
    facebook: 'voluntarilyAotearoa',
    twitter: 'voluntarilyHQ',
    address: '237 Test Street, Testland'
  },
  {
    _id: objectid().toString(),
    name: 'OMGTech',
    slug: 'omgtech',
    role: [OrganisationRole.ACTIVITY_PROVIDER, OrganisationRole.VOLUNTEER_PROVIDER],
    imgUrl: 'https://images.squarespace-cdn.com/content/556e9677e4b099ded4a2e757/1488844920526-ZGL78IXEPYARVWLL778H/OMGTECH.png?content-type=image%2Fpng',
    info: {
      about: 'Awesome content providers'
    }
  },
  {
    _id: objectid().toString(),
    name: 'Datacom',
    slug: 'datacom',
    role: [OrganisationRole.VOLUNTEER_PROVIDER],
    imgUrl: 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2F-cq6IrCmLVAQ%2FAAAAAAAAAAI%2FAAAAAAAAAAA%2FcEuff2J9PJ8%2Fs900-c-k-no-mo-rj-c0xffffff%2Fphoto.jpg&f=1',
    info: { about: 'some of our most loyal helpers' }
  },
  {
    _id: objectid().toString(),
    name: 'Spark Ltd',
    slug: 'spark',
    role: [OrganisationRole.VOLUNTEER_PROVIDER],
    imgUrl: 'https://image.shutterstock.com/image-vector/raven-sedentary-birds-never-voluntarily-260nw-1339914020.jpg',
    info: { about: 'more of our most loyal helpers' }
  },
  {
    _id: objectid().toString(),
    imgUrl: 'https://image.shutterstock.com/image-vector/raven-sedentary-birds-never-voluntarily-260nw-1339914020.jpg',
    name: 'Westpac Ltd',
    slug: 'westpac',
    role: [OrganisationRole.VOLUNTEER_PROVIDER],
    info: { about: 'even more of our most loyal helpers' }
  },
  {
    _id: objectid().toString(),
    name: 'Albany High School',
    imgUrl: 'https://image.shutterstock.com/image-vector/raven-sedentary-birds-never-voluntarily-260nw-1339914020.jpg',
    slug: 'albany-high',
    role: [OrganisationRole.OPPORTUNITY_PROVIDER],
    info: { }
  }
]
