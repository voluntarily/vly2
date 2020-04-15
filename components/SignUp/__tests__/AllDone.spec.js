import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import AllDone from '../AllDone'

const person = {
  nickname: 'testy',
  imgUrl: 'https://example.com/img.png',
  imgUrlSm: 'https://example.com/imgsm.png',
  locations: ['Auckland']
}

const topicGroups = {
  business: true,
  community: false,
  education: true
}
test('AllDone renders properly', t => {
  const wrapper = mountWithIntl(
    <AllDone type='ask' topicGroups={topicGroups} person={person}>
      <p>Test child</p>
    </AllDone>
  )
  t.is(wrapper.find('img').first().props().src, '/static/img/sign-up/alldone.svg')
  t.is(wrapper.find('h1').first().text(), 'You are ready to go')
  t.true(wrapper.exists('PersonSummary'))
  t.true(wrapper.exists('TopicSummary'))
})
