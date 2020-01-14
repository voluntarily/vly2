import test from 'ava'
import OrgBanner from '../OrgBanner'
import { shallow } from 'enzyme'
import objectid from 'objectid'

/* OrgBanner is much like OrgCard but spread across the top of a page */
const org = {
  _id: objectid(),
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: '/static/andrew.jpg',
  category: ['vp', 'ap'],
  contactEmail: 'andrew@voluntarily.nz',
  website: 'https://voluntarily.nz',
  facebook: 'voluntarilyAotearoa',
  twitter: 'voluntarilyHQ'
}

test('OrgBanner has image, title and category icon', t => {
  const children = <p>Test</p>
  const wrapper = shallow(<OrgBanner org={org} children={children} />)
  t.is(wrapper.find('h1').first().text(), `<OrgCategory />${org.name}`)
  t.is(wrapper.find('img').first().prop('src'), org.imgUrl)
  t.true(wrapper.exists('OrgCategory'))
  // t.is(wrapper.find('a').first().text(), org.website)
  t.is(wrapper.find('p').first().text(), 'Test')
})

// test('OrgBanner with no website', t => {
// const orgNoWeb = {
//   _id: objectid(),
//   name: 'OMGTech',
//   slug: 'hello-omgtech',
//   imgUrl: '/static/andrew.jpg',
//   category: ['vp', 'ap']
// }
//   const children = <p>Test</p>
//   const wrapper = shallow(<OrgBanner org={orgNoWeb} children={children} />)
//   t.is(wrapper.find('h1').first().text(), org.name)
//   t.is(wrapper.find('img').first().prop('src'), org.imgUrl)
//   t.not(wrapper.exists('a'))
// })
