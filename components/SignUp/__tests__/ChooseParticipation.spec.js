import test from 'ava'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import ChooseParticipation from '../ChooseParticipation'

test('ChooseParticipation renders properly', t => {
  const handleAsk = sinon.fake()
  const handleOffer = sinon.fake()

  const wrapper = mountWithIntl(
    <ChooseParticipation
      roleAsk
      onChangeAsk={handleAsk}
      roleOffer={false}
      onChangeOffer={handleOffer}
    >
      <p>Test child</p>
    </ChooseParticipation>
  )
  t.is(wrapper.find('img').first().props().src, '/static/img/sign-up/chooseparticipation.svg')
  t.is(wrapper.find('h1').first().text(), 'How do you want to use Voluntarily?')
  t.is(wrapper.find('ToggleLi').length, 2)
  const ask = wrapper.find('ToggleLi').first()
  const offer = wrapper.find('ToggleLi').last()
  t.is(ask.find('h2 FormattedMessage').props().id, 'ChooseParticipation.title.ask')
  t.is(offer.find('h2 FormattedMessage').props().id, 'ChooseParticipation.title.offer')
})
