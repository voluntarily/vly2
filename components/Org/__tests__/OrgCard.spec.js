import test from 'ava'
import OrgCard from '../OrgCard'
import { mount } from 'enzyme'

const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: '/static/andrew.jpg',
  about:
    'OMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them',
  type: ['vp']
}

const props = {
  org
}

test('OrgCard renders properly', t => {
  const wrapper = mount(<OrgCard {...props} />)
  // console.log(wrapper.find('p').at(1).text())
  t.is(
    wrapper
      .find('p')
      .at(0)
      .text(),
    org.name
  )
  // t.is(
  //   wrapper
  //     .find('p')
  //     .at(1)
  //     .text(),
  //   org.type.join('')
  // )

  // t.is(
  //   wrapper
  //     .find('p')
  //     .at(2)
  //     .text(),
  //   org.about
  // )

  // t.deepEqual(wrapper.prop('org'), props.org);
})
