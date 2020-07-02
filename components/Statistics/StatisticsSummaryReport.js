import React, { useEffect, useState } from 'react'
import { LoadSpinner } from '../Loading'
import fetch from 'isomorphic-fetch'
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
  const [summaryData, setSummaryData] = useState()
  const [summaryError, setSummaryError] = useState()
  const [summaryLoading, setSummaryLoading] = useState()

  useEffect(() => {
    setSummaryLoading(true)
    fetch(`/api/statistics/summary/${orgId}/${timeframe}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error()
        }
        setSummaryError(undefined)
        return res.json()
      })
      .then((data) => setSummaryData(data))
      .catch((err) => setSummaryError(err))
      .finally(() => setSummaryLoading(false))
  }, [orgId, timeframe])

  if (summaryLoading) {
    return <LoadSpinner />
  }

  if (summaryError) {
    return (
      <p>Summary information currently unavailable. Please try again later.</p>
    )
  }

  const { totalVolunteers, totalHours, avgHoursPerVolunteer } =
    summaryData || {}

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
