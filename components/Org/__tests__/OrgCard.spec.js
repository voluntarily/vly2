import test from 'ava'
import OrgCard from '../OrgCard'
import { render } from 'enzyme'

const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: '/static/andrew.jpg',
  about: 'OMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them',
  type: 'activity-provider'
}

const props = {
  org
}

test('OrgCard renders properly', t => {
  const wrapper = render(
    <OrgCard {...props} />
  )

  t.is(wrapper.find('h1').first().text(), org.name)
  t.regex(wrapper.find('p').first().text(), new RegExp(org.about))
  t.is(wrapper.find('small').first().text(), org.type)
  // t.deepEqual(wrapper.prop('org'), props.org);
})
