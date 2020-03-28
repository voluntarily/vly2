import adminPage from '../../hocs/adminPage'
import { FullPage } from '../../components/VTheme/VTheme'
import { useState, useEffect } from 'react'
import callApi from '../../lib/callApi'
import { Button, List, Statistic, Table } from 'antd'
import cuid from 'cuid'

const SummaryReport = () => {
  const initSummary = {
    Person: { total: 0 },
    Activity: { total: 0 },
    Interest: { total: 0, status: {}},
    Member: { total: 0, status: {}},
    Opportunity: { total: 0, type: {}},
    Organisation: { total: 0, category: {}},
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
    { label: 'People', value: summary.Person.total },
    { label: 'Asks', value: summary.Opportunity.status && summary.Opportunity.status.ask },
    { label: 'Offers', value: summary.Opportunity.offer && summary.Opportunity.status.offer },
    { label: 'Interests', value: summary.Interest.total },
    { label: 'Activities', value: summary.Activity.total },
    { label: 'Members', value: summary.Member.total },
  ]


  return (
    <FullPage>
      <h1>Summary Report</h1>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={stats}
        renderItem={item => (
          <List.Item>
            <Statistic title={item.label} value={item.value} />
          </List.Item>
        )}
      />

      <Table
        pagination={false}
        columns={[
          {title: 'Member type', dataIndex: 'type', key: 'type'},
          {title: 'Count', dataIndex: 'count', key: 'count'}
        ]}
        dataSource={Object.keys(summary.Member.status).map(k =>
          ({type: k, count: summary.Member.status[k]})
        )}
      />

      <Table
        pagination={false}
        columns={[
          {title: 'Organisation categories', dataIndex: 'type', key: 'type'},
          {title: 'Count', dataIndex: 'count', key: 'count'}
        ]}
        dataSource={Object.keys(summary.Organisation.category).map(k =>
          ({type: k, count: summary.Organisation.category[k]})
        )}
      />

      <Table
        pagination={false}
        columns={[
          {title: 'Interest status', dataIndex: 'status', key: 'status'},
          {title: 'Count', dataIndex: 'count', key: 'count'}
        ]}
        dataSource={Object.keys(summary.Interest.status).map(k =>
          ({type: k, count: summary.Interest.status[k]})
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
