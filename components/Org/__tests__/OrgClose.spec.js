import test from 'ava'
import OrgClose from '../OrgClose'
import { shallow } from 'enzyme'
import CloseCard from '../../Close/CloseActionCard'

test('OrgClose renders cards ', t => {
  const wrapper = shallow(<OrgClose />)
  t.is(wrapper.find(CloseCard).length, 4)
})
