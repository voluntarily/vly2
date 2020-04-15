import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { ToggleLi } from '../SignUpStyles'
import sinon from 'sinon'

test('ToggleLi renders properly', t => {
  const handleChange = sinon.fake()

  const wrapper = mountWithIntl(
    <ToggleLi 
      key='1' 
      icon='school' 
      checked={false} 
      onChange={handleChange}>
      <p>Test children</p>
    </ToggleLi>
  )
  t.false(wrapper.find('ToggleTick').first().props().on)
  wrapper.find('li').first().props().onClick()
  wrapper.update()
  t.true(wrapper.find('ToggleTick').first().props().on)
})
