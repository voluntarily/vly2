import React from 'react'
import { useStatisticsAPI } from '../../lib/statistics/statisticsHooks'
import { LoadSpinner } from '../Loading'
import { Row, Col } from 'antd'
import styled from 'styled-components'
import _ from 'lodash'

const SummaryValue = styled.p`
  font-weight: 600;
  font-size: 80px;
  margin-bottom: 0;
  text-align: center;
`

const SummaryLabel = styled.p`
  font-size: 24px;
  text-align: center;
`

const StatisticsSummaryReport = ({ orgId, timeframe }) => {
  const { data, error, loading } = useStatisticsAPI(
    'summary',
    orgId,
    timeframe
  )

  if (loading) {
    return <LoadSpinner />
  }

  if (error) {
    return (
      <p>Summary information currently unavailable. Please try again later.</p>
    )
  }

  const { totalVolunteers, totalHours, avgHoursPerVolunteer } = data || {}

  return (
    <Row type='flex'>
      <Col xs={24} s={24} md={8}>
        <SummaryValue>{totalVolunteers || 0}</SummaryValue>
        <SummaryLabel>volunteer{totalVolunteers === 1 ? '' : 's'}</SummaryLabel>
      </Col>
      <Col xs={24} s={24} md={8}>
        <SummaryValue>{_.round(totalHours, 1) || 0}</SummaryValue>
        <SummaryLabel>hours total</SummaryLabel>
      </Col>
      <Col xs={24} s={24} md={8}>
        <SummaryValue>{_.round(avgHoursPerVolunteer, 1) || 0}</SummaryValue>
        <SummaryLabel>average hours per volunteer</SummaryLabel>
      </Col>
    </Row>
  )
}

export default StatisticsSummaryReport
