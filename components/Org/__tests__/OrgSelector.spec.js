import test from 'ava'
import OrgSelector from '../OrgSelector'
import { shallow } from 'enzyme'
import orgs from './Org.fixture'

test('OrgSelector has list of org names', t => {
  const wrapper = shallow(<OrgSelector orgs={orgs} />)
  t.is(wrapper.find('ForwardRef(InternalSelect)').prop('options').length, orgs.length)
})

test('OrgSelector has no org names', t => {
  const wrapper = shallow(<OrgSelector orgs={[]} />)
  t.is(wrapper.text(), '')
})
