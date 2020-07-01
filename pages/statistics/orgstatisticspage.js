import { FullPage, PageBanner } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import { withStatistics } from '../../lib/redux/reduxApi'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import OrgStatisticsTabs from '../../components/Statistics/OrgStatisticsTabs'
import StatisticsTimeframeSelector from '../../components/Statistics/StatisticsTimeframeSelector'

const OrgStatisticsPage = (props) => {
  useEffect(() => {
    // TODO: remove hard-coded props and connect to organisation tabs and timeframe dropdown
    props.dispatch(
      props.statisticsSummaryActions.get('5e73112a7f283c001151efc1', 'year')
    )
  }, [])

  const [timeframe, setTimeframe] = useState('month')

  const { totalVolunteers, totalHours, avgHoursPerVolunteer } =
    props.statisticsSummary.data[0] || {}

  return (
    <FullPage>
      <PageBanner>
        <h1>
          <FormattedMessage
            id='orgstatisticspage.title'
            defaultMessage='Data Dashboard'
            description='Title on organisation statistics page'
          />
        </h1>

        <FormattedMessage
          id='orgstatisticspage.subtitle'
          defaultMessage='What was your volunteering impact?'
        />

        <StatisticsTimeframeSelector value={timeframe} onChange={e => setTimeframe(e)} />

      </PageBanner>

      <OrgStatisticsTabs />

      {totalVolunteers} {totalHours} {avgHoursPerVolunteer}
    </FullPage>
  )
}

export default securePage(withStatistics(OrgStatisticsPage))
