import test from 'ava'
import { OrgStatisticsPage } from '../../pages/statistics/orgstatisticspage'
import { shallowWithIntl } from '../../lib/react-intl-test-helper'

test('orgtatisticspage renders correctly', t => {
  const wrapper = shallowWithIntl(<OrgStatisticsPage />)

  t.true(wrapper.exists())
  t.true(wrapper.find('StatisticsTimeframeSelector').exists())
  t.true(wrapper.findWhere(n => n.props().defaultMessage === 'Data Dashboard').exists())
  t.true(wrapper.findWhere(n => n.props().defaultMessage === 'What was your volunteering impact?').exists())
})
