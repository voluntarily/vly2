import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LoadSpinner } from '../Loading'
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts'
import styled from 'styled-components'
import { useStatisticsAPI } from '../../lib/statistics/statisticsHooks'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#653CAD']

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const StatisticsActivityTagsReport = ({ orgId, timeframe }) => {
  const { data, error, loading } = useStatisticsAPI(
    'activityTags',
    orgId,
    timeframe
  )

  if (loading) {
    return <LoadSpinner />
  }

  if (error) {
    return (
      <p>Activity tags information currently unavailable. Please try again later.</p>
    )
  }

  if (!data || !data.length) {
    return <p>No activity tags data found.</p>
  }

  return (
    <Container>
      <h3>
        <FormattedMessage
          id='StatisticsActivityTagsReport.title'
          defaultMessage='What did they do?'
          description='Title on statistics activity tags report'
        />
      </h3>
      <ResponsiveContainer width='95%' height={400}>
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
      </ResponsiveContainer>
    </Container>
  )
}

export default StatisticsActivityTagsReport
