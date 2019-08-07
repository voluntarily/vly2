import test from 'ava'
import OrgDetail from '../OrgDetail'
import { mount } from 'enzyme'

const org = {
  _id: 'f34gb2bh24b24b2',
  name: 'OMGTech',
  slug: 'hello-omgtech',
  imgUrl: '/static/andrew.jpg',
  about:
    'OMGTech! develops & delivers engaging workshops for both teachers and students on digital technologies and how to explore and invent with them',
  category: ['vp'],
  website: 'omg.com',
  facebook: 'OMGTech',
  twitter: '@OMGTech'
}

const props = {
  org
}

test('OrgDetail renders properly', t => {
  const wrapper = mount(<OrgDetail {...props} />)

  t.is(
    wrapper
      .find('p')
      .at(0)
      .text(),
    'Get in touch'
  )

  t.is(
    wrapper
      .find('svg')
      .length,
    9
  )
})

const props2 = {
  org: { ...org, website: null }
}

test('OrgDetail renders properly 2', t => {
  const wrapper = mount(<OrgDetail {...props2} />)

  t.is(
    wrapper
      .find('svg')
      .length,
    8
  )
})
