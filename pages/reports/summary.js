import adminPage from '../../hocs/adminPage'
import { FullPage } from '../../components/VTheme/VTheme'
import { useState, useEffect } from 'react'
import callApi from '../../lib/callApi'
import { Button, List, Statistic } from 'antd'
import cuid from 'cuid'

const SummaryReport = () => {
  const initSummary = {
    Person: 0,
    Opportunity: { ask: 0, offer: 0 }
  }
  const [summary, setSummary] = useState(initSummary)
  const [resets, setResets] = useState('')

  useEffect(() => {
    const getSummaryCounts = async () => {
      const summary = await callApi('reports/summary')
      setSummary(summary)
    }
    getSummaryCounts()
  }, [resets])

  const stats = [
    { label: 'People', value: summary.Person },
    { label: 'Asks', value: summary.Opportunity.ask },
    { label: 'Offers', value: summary.Opportunity.offer }
  ]

  return (
    <FullPage>
      <h1>Summary Report</h1>
      {/* <pre>{JSON.stringify(summary, 2)}</pre> */}
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={stats}
        renderItem={item => (
          <List.Item>
            <Statistic title={item.label} value={item.value} />
          </List.Item>
        )}
      />

      <Button
        style={{ marginTop: 16 }}
        shape='round'
        type='primary'
        onClick={() => setResets(cuid())}
      >
        Reload
      </Button>
    </FullPage>
  )
}

export default adminPage(SummaryReport)
