
import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'
import RegisterInterestMessageForm from '../../components/Interest/RegisterInterestMessageForm'
import { useState } from 'react'
import { Button } from 'antd'

const TestPublicPage = ({ locale, session, isAuthenticated }) => {
  const [msg, setMsg] = useState('init message')
  const [showForm, setShowForm] = useState(false)
  const [prevAccepted, setPrevAccepted] = useState(false)

  const handleSubmit = (ok, msg) => {
    if (ok) {
      setPrevAccepted(true)
      setMsg(msg.message)
    }
    setShowForm(false)
  }

  return (
    <FullPage>
      <h1>Register Interest Message Form</h1>
      {!showForm && (
        <Button
          type='primary'
          shape='round'
          onClick={() => setShowForm(true)}
        >
        I'm Interested
        </Button>)}

      <RegisterInterestMessageForm
        title="I'm Interested"
        prevAccepted={prevAccepted}
        onSubmit={handleSubmit}
        placeholder='leave a message for Andrew'
        visible={showForm}
      />

      <p>{msg} {prevAccepted ? 'true' : 'false'}</p>
    </FullPage>
  )
}

export default publicPage(TestPublicPage)
