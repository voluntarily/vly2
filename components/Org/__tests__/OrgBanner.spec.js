import test from 'ava'
import OrgBanner from '../OrgBanner'
import { VBannerImg } from '../../VTheme/Profile'
import { shallow } from 'enzyme'
import objectid from 'objectid'
import { OrganisationRole } from '../../../server/api/organisation/organisation.constants'

/* OrgBanner is much like OrgCard but spread across the top of a page */
const org = {
  _id: objectid(),
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: '/static/andrew.jpg',
  role: [OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER],
  contactEmail: 'andrew@voluntarily.nz',
  website: 'https://voluntarily.nz',
  facebook: 'voluntarilyAotearoa',
  twitter: 'voluntarilyHQ'
}

test('OrgBanner has image, and title', t => {
  const children = <p>Test</p>
  const wrapper = shallow(<OrgBanner org={org} children={children} />)
  t.is(wrapper.find('h1').first().text(), `${org.name}`)
  t.is(wrapper.find(VBannerImg).first().prop('src'), org.imgUrl)
  // t.is(wrapper.find('a').first().text(), org.website)
  t.is(wrapper.find('p').last().text(), 'Test')
})

// test('OrgBanner with no website', t => {
// const orgNoWeb = {
//   _id: objectid(),
//   name: 'OMGTech',
//   slug: 'hello-omgtech',
//   imgUrl: '/static/andrew.jpg',
//   role: [OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER]
// }
//   const children = <p>Test</p>
//   const wrapper = shallow(<OrgBanner org={orgNoWeb} children={children} />)
//   t.is(wrapper.find('h1').first().text(), org.name)
//   t.is(wrapper.find('img').first().prop('src'), org.imgUrl)
//   t.not(wrapper.exists('a'))
// })
