import Head from 'next/head'
import { Button, message } from 'antd'
import { FormattedMessage } from 'react-intl'
import { FullPage, Section } from '../../components/VTheme/VTheme'
import adminPage from '../../hocs/adminPage'
import fetch from 'isomorphic-fetch'

const TestPage = () => {
  const handleRunTest = async () => {
    try {
      await fetch('/api/xadmin/runTest')
      message.success('done')
    } catch (e) { console.error('handleRunTest Failed', e) }
  }

  return (
    <FullPage>
      <Head>
        <title>Voluntarily - E2E Testing</title>
      </Head>
      <h1>
        <FormattedMessage id='runTestTitle' defaultMessage='End-To-End Testing' description='title on Test index page' />
      </h1>
      <Section>
        <h2>Run Test</h2>
        <p>Each run creates a result test cycle and can tell you where the test failed.</p>
        <Button shape='round' type='primary' onClick={handleRunTest}>Run Test</Button>
      </Section>
    </FullPage>
  )
}

export default adminPage(TestPage)
