import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LoadSpinner } from '../Loading'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts'
import styled from 'styled-components'
import { useStatisticsAPI } from '../../lib/statistics/statisticsHooks'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#653CAD']

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const StatisticsLocationsReport = ({ orgId, timeframe }) => {
  const { data, error, loading } = useStatisticsAPI(
    'locations',
    orgId,
    timeframe
  )

  if (loading) {
    return <LoadSpinner />
  }

  if (error) {
    return (
      <p>
        Locations information currently unavailable. Please try again later.
      </p>
    )
  }

  if (!data || !data.length) {
    return <p>No location data found.</p>
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
        <Pie data={data} outerRadius={80} label>
          {data &&
            data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Container>
  )
}

export default StatisticsLocationsReport
