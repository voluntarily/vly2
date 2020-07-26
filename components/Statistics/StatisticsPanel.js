import React from 'react'
import { Divider } from 'antd'
import StatisticsSummaryReport from './StatisticsSummaryReport'
import StatisticsLocationsReport from './StatisticsLocationsReport'
import StatisticsActivityTagsReport from './StatisticsActivityTagsReport'
import StatisticsRatingsReport from './StatisticsRatingsReport'

const StatisticsPanel = ({ orgId, timeframe }) => {
  return (
    <div>
      <StatisticsSummaryReport orgId={orgId} timeframe={timeframe} />
      <Divider />
      <StatisticsLocationsReport orgId={orgId} timeframe={timeframe} />
      <Divider />
      <StatisticsActivityTagsReport orgId={orgId} timeframe={timeframe} />
      <Divider />
      <StatisticsRatingsReport orgId={orgId} timeframe={timeframe} />
      <Divider />
    </div>
  )
}

export default StatisticsPanel
