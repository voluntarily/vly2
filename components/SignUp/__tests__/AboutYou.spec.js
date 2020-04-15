import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import AboutYou from '../AboutYou'
import sinon from 'sinon'
import { Provider } from 'react-redux'
import { makeStore } from '../../../lib/redux/reduxApi'

const person = {
  nickname: 'testy',
  imgUrl: 'https://example.com/img.png',
  imgUrlSm: 'https://example.com/imgsm.png',
  locations: ['Auckland']
}

const initStore = {
  locations: {
    sync: true,
    data: ['Auckland', 'Wellington', 'Christchurch']
  }
}

test('AboutYou renders properly', t => {
  const realStore = makeStore(initStore)
  const handleAboutYou = sinon.fake()
  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <AboutYou person={person} onChange={handleAboutYou}>
        <p>Test child</p>
      </AboutYou>
    </Provider>
  )
  t.is(wrapper.find('img').first().props().src, '/static/img/sign-up/aboutyou.svg')
  t.is(wrapper.find('h1').first().text(), 'About You')
  t.true(wrapper.exists('Input#nickname'))
  // wrapper.find('Input#nickname').simulate('change', { target: { value: 'TestyNickname' } })
  wrapper.find('Input#nickname').props().onChange({ target: { value: 'TestyNickname' } })
  t.true(handleAboutYou.calledOnce)
  wrapper.find('ImageUpload').props().setImgUrl('https://example.com/imgUrl.png', { lg: 'https://example.com/imgUrl.png', sm: 'https://example.com/imgUrl.png' })
  t.true(handleAboutYou.calledTwice)
  wrapper.find('TagSelect').props().onChange(['Christchurch'])
  t.true(handleAboutYou.calledThrice)
})
