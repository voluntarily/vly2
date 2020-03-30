const { OrganisationRole } = require('../organisation.constants')
const orgList = [
  {
    name: 'Voluntarily Administrators',
    slug: 'voluntarily-administrators',
    role: [OrganisationRole.ADMIN],
    imgUrl: 'https://example.com/image1',
    info: {
      about: 'Industry in the classroom.',
      members: 'You are a member of Voluntarily.',
      followers: 'You are a follower of Voluntarily.',
      joiners: 'You are a nearly a member of Voluntarily.',
      outsiders: 'You could be a member of Voluntarily.'
    },
    contactEmail: 'admin@voluntarily.nz',
    website: 'https://voluntarily.nz',
    facebook: 'voluntarilyAotearoa',
    twitter: 'voluntarilyHQ'
  },
  {
    name: 'OMGTech',
    slug: 'omgtech',
    role: [OrganisationRole.ACTIVITY_PROVIDER, OrganisationRole.OPPORTUNITY_PROVIDER],
    imgUrl: 'https://example.com/image2',
    info: {
      about: `Awesome content providersOMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them
      NEW - Professional development for the Digital Technologies Curriculum.
      OMGTech! is an accredited provider of professional development by the Ministry of Education. Our facilitators that will work with your staff to create a customised PLD programme just for you.
      `
    },
    contactEmail: 'admin@omgtech.co.nz',
    website: 'https://omgtech.nz',
    facebook: 'fillerfacebook',
    twitter: 'voluntarilyHQ',
    contactName: 'contact name',
    contactPhoneNumber: '123 4567',
    address: 'somewhere someplace far far away',
    ageRange: { from: -1, to: 102 }
  },
  {
    name: 'Datacom',
    slug: 'datacom',
    role: [OrganisationRole.VOLUNTEER_PROVIDER],
    imgUrl: 'https://example.com/image3',
    info: { about: 'some of our most loyal helpers' }
  },
  {
    name: 'Spark Ltd',
    slug: 'spark-ltd',
    role: [OrganisationRole.VOLUNTEER_PROVIDER],
    imgUrl: 'https://example.com/image4',
    info: { about: 'more of our most loyal helpers' }
  },
  {
    name: 'Westpac Ltd',
    slug: 'westpac-ltd',
    role: [OrganisationRole.VOLUNTEER_PROVIDER],
    info: { about: 'even more of our most loyal helpers' }
  },
  {
    name: 'Albany Senior High School',
    slug: 'albany-senior-high-school',
    imgUrl: 'http://www.ashs.school.nz/images/logo.png',
    role: [OrganisationRole.OPPORTUNITY_PROVIDER],
    info: {
      about:
      `
Nurture. Inspire. Empower.
Every student comes to us with unique gifts and strengths.

At Albany Senior High School it is our dream to nurture those 
strengths so that after 3 exciting and formative years with us the 
students will be inspiring young New Zealanders and world citizens 
who are empowered to make a difference.`
    },
    contactEmail: 'info@ashs.school.nz',
    website: 'https://omgtech.nz',
    facebook: 'fillerfacebook',
    twitter: 'voluntarilyHQ',
    contactName: 'contact name',
    contactPhoneNumber: '(09) 451 9065',
    address: '536 Albany Highway, Albany, Auckland 0632',
    decile: 5,
    ageRange: { from: 16, to: 18 }
  }
]

module.exports = orgList
