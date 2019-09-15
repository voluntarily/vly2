import test from 'ava'
import WomensRefuge from '../WomensRefuge.js'
import { mount } from 'enzyme'
// mock function to test the render of Women's Refuge button
global.ds07o6pcmkorn = function (e) {
  this.init = () => { console.log('refuge called')} 
}

test('Womens refuge button renders properly', t => {
  const wrapper = mount(<WomensRefuge />)
  t.truthy(wrapper.find('a').first().hasClass('WomensRefuge-class'))
  t.truthy(wrapper.find('a').simulate('click'))

})

