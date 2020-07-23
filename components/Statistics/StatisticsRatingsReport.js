import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LoadSpinner } from '../Loading'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Label } from 'recharts'
import { useStatisticsAPI } from '../../lib/statistics/statisticsHooks'
import { StatisticsReportContainer } from './StatisticsStyles'
import styled from 'styled-components'
import _ from 'lodash'

const AverageRatingText = styled.strong`
  font-size: 24px;
`

const StatisticsRatingsReport = ({ orgId, timeframe }) => {
  const { data, error, loading } = useStatisticsAPI(
    'ratings',
    orgId,
    timeframe
  )

  if (loading) {
    return <LoadSpinner />
  }

  if (error) {
    return (
      <p>
        Ratings information currently unavailable. Please try again later.
      </p>
    )
  }

  if (!data || !data.length) {
    return <p>No rating data found.</p>
  }

  const { numRatings, totalRating } = data.reduce((acc, cur) => {
    acc.numRatings += cur.value
    acc.totalRating += cur.name * cur.value
    return acc
  }, { numRatings: 0, totalRating: 0 })
  const avgRating = totalRating / numRatings

  if (!numRatings) {
    return <p>No rating data found.</p>
  }

  return (
    <StatisticsReportContainer>
      <h3>
        <FormattedMessage
          id='StatisticsRatingsReport.title'
          defaultMessage='How did they find it?'
          description='Title on statistics ratings report'
        />
      </h3>

      <p>
        Last {timeframe}, your volunteers provided <AverageRatingText>{numRatings}</AverageRatingText> ratings, with an average rating of <AverageRatingText>{_.round(avgRating, 2)}/5</AverageRatingText>.
      </p>

      <ResponsiveContainer width='95%' height={400}>

        <BarChart width={800} height={400} data={data} barCategoryGap='20%'>
          <XAxis dataKey='name'>
            <Label value='Star rating' offset={0} position='insideBottom' />
          </XAxis>
          <YAxis allowDecimals={false}>
            <Label value='Number of ratings' angle={-90} position='insideLeft' offset={0} />
          </YAxis>
          <Bar dataKey='value' fill='#653CAD' />

        </BarChart>
      </ResponsiveContainer>
    </StatisticsReportContainer>
  )
}

export default StatisticsRatingsReport
