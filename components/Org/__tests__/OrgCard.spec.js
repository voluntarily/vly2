import test from 'ava'
import OrgCard from '../OrgCard'
import { mount } from 'enzyme'

const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: '/static/andrew.jpg',
  category: ['vp', 'ap']
}

test('OrgCard has image, title and category icon', t => {
  const wrapper = mount(<OrgCard org={org} />)
  t.is(wrapper.find('h1').first().text(), org.name)
  t.is(wrapper.find('img').first().prop('src'), org.imgUrl)
  t.truthy(wrapper.find('i').first().hasClass('anticon-bank'))
  t.truthy(wrapper.find('i').last().hasClass('anticon-thunderbolt'))
})
