import React, { useEffect, useState } from 'react'
import { LoadSpinner } from '../Loading'
import fetch from 'isomorphic-fetch'

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
    <div>
      {totalVolunteers} {totalHours} {avgHoursPerVolunteer}
    </div>
  )
}

export default StatisticsSummaryReport
