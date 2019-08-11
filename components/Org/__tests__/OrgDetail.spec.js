import test from 'ava'
import OrgDetail from '../OrgDetail'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

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

const meid = '12345678'
const props = {
  org,
  meid
}

test('OrgDetail renders properly', t => {
  const wrapper = mountWithIntl(<OrgDetail {...props} />)

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
    7
  )
})

const props2 = {
  org: { ...org, website: null },
  meid
}

test('OrgDetail renders properly 2', t => {
  const wrapper = mountWithIntl(<OrgDetail {...props2} />)

  t.is(
    wrapper
      .find('svg')
      .length,
    6
  )
})
