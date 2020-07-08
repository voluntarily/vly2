import test from 'ava'
import { shallow } from 'enzyme'
import StatisticsTimeframeSelector from '../StatisticsTimeframeSelector'

test('StatisticsTimeframeSelector renders correctly', t => {
  const wrapper = shallow(<StatisticsTimeframeSelector />)

  t.true(wrapper.exists())
  t.true(wrapper.findWhere(n => n.text() === 'Last Month').exists())
  t.true(wrapper.findWhere(n => n.text() === 'Last Year').exists())
})
