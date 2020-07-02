import React from 'react'
import { Divider } from 'antd'
import StatisticsSummaryReport from './StatisticsSummaryReport'

const StatisticsPanel = ({ orgId, timeframe }) => {
  return (
    <div>
      <StatisticsSummaryReport orgId={orgId} timeframe={timeframe} />
      <Divider />
    </div>
  )
}

export default StatisticsPanel
