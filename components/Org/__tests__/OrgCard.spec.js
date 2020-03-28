import test from 'ava'
import OrgCard from '../OrgCard'
import { shallow } from 'enzyme'
import { OrganisationRole } from '../../../server/api/organisation/organisation.constants'

const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: '/static/andrew.jpg',
  role: [OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER]
}

test('OrgCard has image, title and role icon', t => {
  const wrapper = shallow(<OrgCard org={org} />)
  t.is(wrapper.find('h1').first().text(), org.name)
  t.is(wrapper.find('img').first().prop('src'), org.imgUrl)
  t.true(wrapper.exists('OrgRole'))
})
