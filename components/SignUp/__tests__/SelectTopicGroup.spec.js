import test from 'ava'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import SelectTopicGroup from '../SelectTopicGroup'

const topicGroups = {
  business: true,
  community: false,
  education: true
}

test('SelectTopicGroup renders properly', t => {
  const handleChange = sinon.fake()

  const wrapper = mountWithIntl(
    <SelectTopicGroup
      type='ask'
      topicGroups={topicGroups}
      onChange={handleChange}
    >
      <p>Test child</p>
    </SelectTopicGroup>
  )
  t.is(wrapper.find('img').first().props().src, '/static/img/sign-up/topic.svg')
  t.is(wrapper.find('h1').first().text(), 'What would you like to get help with?')
  t.is(wrapper.find('ToggleLi').length, 3)
  const business = wrapper.find('ToggleLi').at(0)
  const community = wrapper.find('ToggleLi').at(1)
  const education = wrapper.find('ToggleLi').at(2)
  t.is(business.find('h2 FormattedMessage').props().id, 'SelectTopicGroup.title.business')
  business.props().onChange({ business: true })
  t.true(handleChange.calledOnce)
  t.is(community.find('h2 FormattedMessage').props().id, 'SelectTopicGroup.title.community')
  community.props().onChange({ community: true })
  t.true(handleChange.calledTwice)
  t.is(education.find('h2 FormattedMessage').props().id, 'SelectTopicGroup.title.education')
  education.props().onChange({ education: true })
  t.true(handleChange.calledThrice)
})
