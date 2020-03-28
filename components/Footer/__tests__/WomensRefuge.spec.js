import test from 'ava'
import WomensRefuge from '../WomensRefuge.js'
import { mount } from 'enzyme'
// mock function to test the render of Women's Refuge button
global.ds07o6pcmkorn = function (e) {
  this.init = () => { }
}

test('Womens refuge button renders properly', t => {
  const wrapper = mount(<WomensRefuge />)
  console.log(wrapper.debug())
  t.true(wrapper.exists('img#shielded-logo'))
  wrapper.find('img#shielded-logo').first().simulate('click')
  wrapper.update()
  t.true(wrapper.exists('#wfclose'))
  wrapper.find('#wfclose').first().simulate('click')
})
