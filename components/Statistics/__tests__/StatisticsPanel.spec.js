import test from 'ava'
import { shallow } from 'enzyme'
import StatisticsPanel from '../StatisticsPanel'

test('StatisticsPanel renders correctly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'
  const wrapper = shallow(<StatisticsPanel orgId={orgId} timeframe={timeframe} />)

  t.true(wrapper.exists())
  t.true(wrapper.find('StatisticsSummaryReport').exists())
  t.true(wrapper.find('StatisticsLocationsReport').exists())
  t.true(wrapper.find('StatisticsActivityTagsReport').exists())
})
