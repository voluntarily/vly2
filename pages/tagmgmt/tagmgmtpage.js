import { FullPage, PageBanner } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import OrgStatisticsTabs from '../../components/Statistics/OrgStatisticsTabs'
import StatisticsTimeframeSelector from '../../components/Statistics/StatisticsTimeframeSelector'

export const OrgStatisticsPage = (props) => {
  const [timeframe, setTimeframe] = useState('month')

  return (
    <FullPage>
      <PageBanner>
        <h1>
          <FormattedMessage
            id='orgstatisticspage.title'
            defaultMessage='Tag Management'
            description='Title on organisation statistics page'
          />
        </h1>

        <FormattedMessage
          id='orgstatisticspage.subtitle'
          defaultMessage='Hellou I am testing this'
        />

        <StatisticsTimeframeSelector value={timeframe} onChange={e => setTimeframe(e)} />

      </PageBanner>

      <OrgStatisticsTabs timeframe={timeframe} />

    </FullPage>
  )
}

export default securePage(OrgStatisticsPage)
