import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { LoadSpinner } from '../Loading'
import fetch from 'isomorphic-fetch'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts'
import styled from 'styled-components'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#653CAD']

const Container = styled.div`
display: flex;
align-items: center;
flex-direction: column;
`

const StatisticsLocationsReport = ({ orgId, timeframe }) => {
  const [locationsData, setLocationsData] = useState([])
  const [locationsError, setLocationsError] = useState()
  const [locationsLoading, setLocationsLoading] = useState()

  useEffect(() => {
    setLocationsLoading(true)
    fetch(`/api/statistics/locations/${orgId}/${timeframe}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error()
        }
        setLocationsError(undefined)
        return res.json()
      })
      .then((data) => setLocationsData(data))
      .catch((err) => setLocationsError(err))
      .finally(() => setLocationsLoading(false))
  }, [orgId, timeframe])

  if (locationsLoading) {
    return <LoadSpinner />
  }

  if (locationsError) {
    return (
      <p>
        Locations information currently unavailable. Please try again later.
      </p>
    )
  }

  return (
    <Container>
      <h3>
        <FormattedMessage
          id='statisticsLocationReport.title'
          defaultMessage='Where did volunteers help?'
          description='Title on statistics locations report'
        />
      </h3>
      <PieChart width={800} height={400}>
        <Pie data={locationsData} outerRadius={80} label>
          {locationsData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Container>
  )
}

export default StatisticsLocationsReport
