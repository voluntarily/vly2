import test from 'ava'
import OpClose from '../OpClose'
import { shallow } from 'enzyme'
import CloseCard from '../../Close/CloseActionCard'

test('OpClose renders cards ', t => {
  const wrapper = shallow(<OpClose />)
  t.is(wrapper.find(CloseCard).length, 3)
})
