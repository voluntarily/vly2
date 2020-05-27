const Organisation = require('../../../server/api/organisation/organisation')
const Member = require('../../../server/api/member/member')
const { MemberStatus } = require('../../../server/api/member/member.constants')
const { OrganisationRole } = require('../../../server/api/organisation/organisation.constants')
const Person = require('../../../server/api/person/person')

/**
 * Create the first admin in the system and the two default organisations
 * Voluntarily - an OP to which everyone is joined
 * Voluntarily Support - the Admin org to which admins are joined. 
 * place the super admin in both
 */
//
// username: VoluntarilyAdmin@mailinator.com
// password: V4i96rCvgfHm9Q6
const makeSuperAdmin = async () => {
  const admin = await Person.findOne({ nickname: 'voluntarilyadmin' })
  if (admin) { return admin }

  const superAdmin = {
    name: 'Voluntarily Administrator',
    nickname: 'voluntarilyadmin',
    imgUrl: 'https://pngimage.net/wp-content/uploads/2018/05/admin-avatar-png.png',
    imgUrlSm: 'https://pngimage.net/wp-content/uploads/2018/05/admin-avatar-png.png',
    email: 'VoluntarilyAdmin@mailinator.com',
    phone: '000 0000 000',
    about: 'Voluntarily Admin for End to End Testing. ',
    tags: ['admin', 'e2etest', 'testing'],
    role: [
      'basic',
      'volunteer',
      'opportunityProvider',
      'activityProvider',
      'orgAdmin',
      'admin'
    ]
  }

  return Person.create(superAdmin)
}

/**
 * create a new master organisation, make the super Admin the orgAdmin
 */

const makeVoluntarilyOrg = async (owner) => {
  let vly = await Organisation.findOne({ slug: 'voluntarily' })
  if (vly) { return vly }
  const org = {
    name: 'Voluntarily',
    slug: 'voluntarily',
    imgUrl: 'https://s3.ap-southeast-2.amazonaws.com/alpha.voluntarily.nz.images/1584929273082-vvvv200_full.png',
    website: 'https://voluntarily.nz',
    role: [
      OrganisationRole.OPPORTUNITY_PROVIDER,
      OrganisationRole.VOLUNTEER_PROVIDER
    ],
    info: {
      about: '<p>When you sign up for the Voluntarily platform you will be automatically joined as a member of this organisation. That will allow you to post new requests and offers. </p><p><br></p><p>You can also join other organisations and become part of their volunteer groups so that you can focus on a speciic region or area of expertise.</p><p><br></p>',
      instructions: 'Getting started instructions',
      followers: 'Message for followers',
      joiners: 'Message for joiners',
      members: 'Message for members'
    }
  }

  if (owner) {
    org.contactName = owner.name
    org.contactEmail = owner.email
    org.contactPhoneNumber = owner.phone
  }
  org.address = '49 Random Street, Auckland, 1010'

  try {
    vly = await Organisation.create(org)
    // make admin member of org
    const member = {
      person: owner._id,
      organisation: vly._id,
      validation: `${owner.email} belongs to ${vly.name}`,
      status: MemberStatus.ORGADMIN
    }
    Member.create(member)
  } catch (e) {
    console.error('Error creating org', e)
    process.exit(2)
  }

  return vly
}

const makeVoluntarilySupportOrg = async (owner) => {
  let vly = await Organisation.findOne({ slug: 'voluntarily-support' })
  if (vly) { return vly }
  const org = {
    name: 'Voluntarily Support',
    imgUrl: 'https://s3.ap-southeast-2.amazonaws.com/alpha.voluntarily.nz.images/1584929645342-vvvv200admin_full.png',
    about: '',
    contactEmail: 'andrew@voluntarily.nz',
    website: 'https://voluntarily.nz',
    facebook: null,
    twitter: null,
    info: {
      about: '<p>Members of this group are system support and admin staff for Voluntarily. </p>'
    },
    domainName: 'volunarily.nz',
    slug: 'voluntarily-support',
    groups: [],
    role: ['admin']
  }

  if (owner) {
    org.contactName = owner.name
    org.contactEmail = owner.email
    org.contactPhoneNumber = owner.phone
  }
  org.address = '49 Random Street, Auckland, 1010'

  try {
    vly = await Organisation.create(org)
    // make admin member of org
    const member = {
      person: owner._id,
      organisation: vly._id,
      validation: `${owner.email} belongs to ${vly.name}`,
      status: MemberStatus.MEMBER
    }
    Member.create(member)
  } catch (e) {
    console.error('Error creating org', e)
    process.exit(2)
  }

  return vly
}

const makeDefaultOrgs = async () => {
  const owner = await makeSuperAdmin()
  await makeVoluntarilyOrg(owner)
  await makeVoluntarilySupportOrg(owner)
}
module.exports = {
  makeDefaultOrgs
}
